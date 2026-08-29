import { useSyncExternalStore } from "react";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  COUPONS,
  finalPrice,
  getProduct,
  type Product,
} from "./products";

/* ------------------------------------------------------------------ */
/* Tiny localStorage-backed store with React subscription              */
/* ------------------------------------------------------------------ */

type Listener = () => void;

function createStore<T>(key: string, initial: T) {
  let value: T = initial;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const read = (): T => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  };

  const ensure = () => {
    if (!hydrated && typeof window !== "undefined") {
      value = read();
      hydrated = true;
    }
    return value;
  };

  const emit = () => listeners.forEach((l) => l());

  return {
    key,
    get: ensure,
    getServer: () => initial,
    set(next: T | ((prev: T) => T)) {
      const prev = ensure();
      value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      hydrated = true;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          /* storage full or unavailable — state still lives in memory */
        }
      }
      emit();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      if (typeof window !== "undefined" && listeners.size === 1) {
        value = read();
        hydrated = true;
        listener();
      }
      return () => listeners.delete(listener);
    },
  };
}

function useStore<T>(store: ReturnType<typeof createStore<T>>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type CartLine = { id: string; qty: number };

export type Address = {
  label: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
};

export type Order = {
  number: string;
  placedAt: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  customer: { name: string; email: string; phone: string };
  address: Address;
  payment: string;
  estimatedDelivery: string;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  signedIn: boolean;
};

const EMPTY_PROFILE: Profile = {
  name: "",
  email: "",
  phone: "",
  city: "Karachi",
  signedIn: false,
};

/* ------------------------------------------------------------------ */
/* Stores                                                              */
/* ------------------------------------------------------------------ */

export const cartStore = createStore<CartLine[]>("lumiere_cart", []);
export const wishlistStore = createStore<string[]>("lumiere_wishlist", []);
export const ordersStore = createStore<Order[]>("lumiere_orders", []);
export const recentStore = createStore<string[]>("lumiere_recent", []);
export const profileStore = createStore<Profile>("lumiere_user", EMPTY_PROFILE);
export const addressStore = createStore<Address[]>("lumiere_addresses", []);

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

export type Toast = { id: number; message: string; tone: "default" | "success" };

const NO_TOASTS: Toast[] = [];
let toasts: Toast[] = [];
const toastListeners = new Set<Listener>();
let toastId = 0;

export const toastStore = {
  get: () => toasts,
  getServer: () => NO_TOASTS,
  subscribe(l: Listener) {
    toastListeners.add(l);
    return () => toastListeners.delete(l);
  },
};

export function notify(message: string, tone: Toast["tone"] = "default") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, tone }];
  toastListeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      toastListeners.forEach((l) => l());
    }, 2600);
  }
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(toastStore.subscribe, toastStore.get, toastStore.getServer);
}

/* ------------------------------------------------------------------ */
/* Cart actions                                                        */
/* ------------------------------------------------------------------ */

export function addToCart(id: string, qty = 1, silent = false) {
  cartStore.set((lines) => {
    const existing = lines.find((l) => l.id === id);
    return existing
      ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l))
      : [...lines, { id, qty }];
  });
  if (!silent) notify(`${getProduct(id)?.name ?? "Item"} added to cart`, "success");
}

export function setCartQty(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id);
  cartStore.set((lines) => lines.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l)));
}

export function removeFromCart(id: string) {
  cartStore.set((lines) => lines.filter((l) => l.id !== id));
  notify("Removed from cart");
}

export function clearCart() {
  cartStore.set([]);
}

export function useCart() {
  return useStore(cartStore);
}

export function useCartCount() {
  return useCart().reduce((n, l) => n + l.qty, 0);
}

export type CartDetail = { product: Product; qty: number; lineTotal: number };

export function detailedCart(lines: CartLine[]): CartDetail[] {
  return lines
    .map((l) => {
      const product = getProduct(l.id);
      if (!product) return null;
      return { product, qty: l.qty, lineTotal: finalPrice(product) * l.qty };
    })
    .filter((x): x is CartDetail => x !== null);
}

export function cartTotals(details: CartDetail[], coupon?: string | null) {
  const subtotal = details.reduce((n, d) => n + d.lineTotal, 0);
  const rule = coupon ? COUPONS[coupon.toUpperCase()] : undefined;
  const discount = !rule
    ? 0
    : rule.type === "percent"
      ? Math.round((subtotal * rule.value) / 100)
      : Math.min(rule.value, subtotal);
  const afterDiscount = Math.max(subtotal - discount, 0);
  const delivery =
    subtotal === 0 ? 0 : afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return { subtotal, discount, delivery, total: afterDiscount + delivery };
}

/* ------------------------------------------------------------------ */
/* Wishlist actions                                                    */
/* ------------------------------------------------------------------ */

export function useWishlist() {
  return useStore(wishlistStore);
}

export function toggleWishlist(id: string) {
  let added = false;
  wishlistStore.set((ids) => {
    if (ids.includes(id)) return ids.filter((x) => x !== id);
    added = true;
    return [...ids, id];
  });
  notify(added ? "Saved to wishlist" : "Removed from wishlist", added ? "success" : "default");
}

export function removeFromWishlist(id: string) {
  wishlistStore.set((ids) => ids.filter((x) => x !== id));
}

export function moveToCart(id: string) {
  addToCart(id, 1, true);
  removeFromWishlist(id);
  notify("Moved to cart", "success");
}

/* ------------------------------------------------------------------ */
/* Orders, profile, recently viewed                                    */
/* ------------------------------------------------------------------ */

export function useOrders() {
  return useStore(ordersStore);
}

export function saveOrder(order: Order) {
  ordersStore.set((orders) => [order, ...orders].slice(0, 25));
}

export function useProfile() {
  return useStore(profileStore);
}

export function saveProfile(update: Partial<Profile>) {
  profileStore.set((p) => ({ ...p, ...update }));
}

export function signOut() {
  profileStore.set(EMPTY_PROFILE);
  notify("Signed out of your demo account");
}

export function useAddresses() {
  return useStore(addressStore);
}

export function saveAddress(address: Address) {
  addressStore.set((list) => {
    const rest = list.filter((a) => a.label !== address.label);
    return [address, ...rest].slice(0, 5);
  });
}

export function removeAddress(label: string) {
  addressStore.set((list) => list.filter((a) => a.label !== label));
}

export function useRecentlyViewed() {
  return useStore(recentStore);
}

export function recordView(id: string) {
  recentStore.set((ids) => [id, ...ids.filter((x) => x !== id)].slice(0, 8));
}

export function makeOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `LH-${new Date().getFullYear()}-${n}`;
}
