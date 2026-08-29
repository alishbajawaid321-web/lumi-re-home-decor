import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { img } from "@/lib/images";
import { PK_CITIES, finalPrice, formatPKR, getProduct } from "@/lib/products";
import {
  notify,
  removeAddress,
  saveProfile,
  signOut,
  useAddresses,
  useOrders,
  useProfile,
  useRecentlyViewed,
  useWishlist,
} from "@/lib/store";
import { EmptyState } from "@/components/site/EmptyState";
import { btnOutline, btnPrimary, inputBase, labelBase } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Lumière Home" },
      {
        name: "description",
        content: "Your Lumière Home profile, orders, saved addresses and recently viewed decor.",
      },
      { property: "og:title", content: "My Account — Lumière Home" },
      { property: "og:description", content: "Manage your profile, orders and saved pieces." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const TABS = ["Profile", "Orders", "Wishlist", "Addresses", "Recently Viewed"] as const;

function AccountPage() {
  const profile = useProfile();
  const orders = useOrders();
  const wishlist = useWishlist();
  const addresses = useAddresses();
  const recent = useRecentlyViewed();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return notify("Please enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      return notify("Please enter a valid email address");
    saveProfile({ ...form, signedIn: true });
    notify("Profile saved", "success");
  };

  return (
    <div className="shell py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">My account</p>
          <h1 className="mt-3 font-display text-5xl">
            {profile.signedIn && profile.name ? `Hello, ${profile.name.split(" ")[0]}` : "Your account"}
          </h1>
        </div>
        {profile.signedIn && (
          <button type="button" onClick={signOut} className={btnOutline}>
            LOG OUT
          </button>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Account sections">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => setTab(t)}
                  aria-current={tab === t}
                  className={cn(
                    "whitespace-nowrap border-b-2 px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors lg:w-full lg:border-b-0 lg:border-l-2 lg:text-left",
                    tab === t
                      ? "border-espresso text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {tab === "Profile" && (
            <form onSubmit={submit} noValidate className="max-w-lg space-y-5">
              <h2 className="font-display text-2xl">Profile details</h2>
              <div>
                <label htmlFor="acc-name" className={labelBase}>
                  Full name
                </label>
                <input
                  id="acc-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputBase}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="acc-email" className={labelBase}>
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputBase}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="acc-phone" className={labelBase}>
                  Phone
                </label>
                <input
                  id="acc-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputBase}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="acc-city" className={labelBase}>
                  City
                </label>
                <select
                  id="acc-city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputBase}
                >
                  {PK_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={btnPrimary}>
                SAVE PROFILE
              </button>
            </form>
          )}

          {tab === "Orders" &&
            (orders.length === 0 ? (
              <EmptyState
                title="You haven't placed any orders yet."
                description="When you do, your order history appears here."
                actionLabel="START SHOPPING"
                actionTo="/shop"
              />
            ) : (
              <ul className="space-y-5">
                {orders.map((o) => (
                  <li key={o.number} className="border border-border">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-cream px-5 py-4">
                      <div>
                        <p className="font-display text-xl">{o.number}</p>
                        <p className="text-xs text-muted-foreground">
                          Placed {new Date(o.placedAt).toLocaleDateString("en-PK")} · {o.payment}
                        </p>
                      </div>
                      <p className="text-sm">{formatPKR(o.total)}</p>
                    </div>
                    <ul className="divide-y divide-border">
                      {o.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                        >
                          <Link
                            to="/product/$id"
                            params={{ id: item.id }}
                            className="min-w-0 truncate hover:text-gold"
                          >
                            {item.name} × {item.qty}
                          </Link>
                          <span>{formatPKR(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                      {o.estimatedDelivery} · {o.address.street}, {o.address.area}, {o.address.city}
                    </p>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "Wishlist" &&
            (wishlist.length === 0 ? (
              <EmptyState
                title="Save pieces you love and find them here later."
                actionLabel="DISCOVER DECOR"
                actionTo="/shop"
              />
            ) : (
              <>
                <MiniGrid ids={wishlist} />
                <Link to="/wishlist" className={cn(btnOutline, "mt-8")}>
                  OPEN FULL WISHLIST
                </Link>
              </>
            ))}

          {tab === "Addresses" &&
            (addresses.length === 0 ? (
              <EmptyState
                title="No saved addresses yet."
                description="Your delivery address is saved automatically after your first order."
                actionLabel="START SHOPPING"
                actionTo="/shop"
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {addresses.map((a) => (
                  <li key={a.label} className="border border-border p-5 text-sm">
                    <p className="eyebrow text-muted-foreground">{a.label}</p>
                    <p className="mt-2 leading-relaxed">
                      {a.street}
                      <br />
                      {a.area}
                      <br />
                      {a.city} {a.postalCode}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeAddress(a.label)}
                      className="mt-4 text-xs uppercase tracking-[0.16em] underline underline-offset-4 hover:text-burgundy"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "Recently Viewed" &&
            (recent.length === 0 ? (
              <EmptyState
                title="Nothing viewed yet."
                description="Products you open will show up here."
                actionLabel="EXPLORE DECOR"
                actionTo="/shop"
              />
            ) : (
              <MiniGrid ids={recent} />
            ))}
        </div>
      </div>
    </div>
  );
}

function MiniGrid({ ids }: { ids: string[] }) {
  const products = ids.map(getProduct).filter((p) => !!p);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <li key={p.id} className="flex gap-4 border border-border p-4">
          <Link to="/product/$id" params={{ id: p.id }} className="w-20 flex-none">
            <img
              src={img(p.imageKey)}
              alt={p.name}
              loading="lazy"
              width={240}
              height={300}
              className="aspect-[4/5] w-full object-cover"
            />
          </Link>
          <div className="min-w-0">
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              className="line-clamp-2 font-display text-lg hover:text-gold"
            >
              {p.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{formatPKR(finalPrice(p))}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
