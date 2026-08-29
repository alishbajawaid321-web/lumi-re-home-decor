import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { img } from "@/lib/images";
import { COUPONS, categoryName, finalPrice, formatPKR, FREE_DELIVERY_THRESHOLD } from "@/lib/products";
import {
  cartTotals,
  detailedCart,
  notify,
  removeFromCart,
  setCartQty,
  toggleWishlist,
  useCart,
} from "@/lib/store";
import { EmptyState } from "@/components/site/EmptyState";
import { btnOutline, btnPrimary, inputBase } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Lumière Home" },
      { name: "description", content: "Review the pieces in your Lumière Home cart before checkout." },
      { property: "og:title", content: "Your Cart — Lumière Home" },
      { property: "og:description", content: "Review your selected decor and check out securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const lines = useCart();
  const details = detailedCart(lines);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const totals = cartTotals(details, coupon);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setCoupon(code);
      notify(`${COUPONS[code].label} applied`, "success");
    } else {
      setCoupon(null);
      notify("That code isn't valid");
    }
  };

  if (details.length === 0) {
    return (
      <div className="shell py-16 md:py-24">
        <h1 className="mb-10 font-display text-5xl">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag width={28} height={28} />}
          title="Your cart is waiting for something beautiful."
          description="Browse the collection and add the pieces that speak to you."
          actionLabel="EXPLORE DECOR"
          actionTo="/shop"
        />
      </div>
    );
  }

  const remainingForFree = FREE_DELIVERY_THRESHOLD - totals.subtotal;

  return (
    <div className="shell py-16 md:py-24">
      <h1 className="font-display text-5xl">Your Cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {details.length} item{details.length === 1 ? "" : "s"}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-border border-y border-border">
          {details.map(({ product, qty, lineTotal }) => (
            <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
              <Link
                to="/product/$id"
                params={{ id: product.id }}
                className="w-24 flex-none sm:w-32"
              >
                <img
                  src={img(product.imageKey)}
                  alt={product.name}
                  loading="lazy"
                  width={320}
                  height={400}
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="eyebrow text-muted-foreground">
                      {categoryName(product.category)}
                    </p>
                    <h2 className="mt-1 font-display text-xl">
                      <Link
                        to="/product/$id"
                        params={{ id: product.id }}
                        className="hover:text-gold"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatPKR(finalPrice(product))} each
                    </p>
                  </div>
                  <p className="font-display text-xl">{formatPKR(lineTotal)}</p>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      onClick={() => setCartQty(product.id, qty - 1)}
                      className="flex h-10 w-10 items-center justify-center hover:bg-cream"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <Minus width={14} height={14} />
                    </button>
                    <span className="w-10 text-center text-sm">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setCartQty(product.id, qty + 1)}
                      className="flex h-10 w-10 items-center justify-center hover:bg-cream"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <Plus width={14} height={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-espresso"
                  >
                    <Heart width={14} height={14} aria-hidden="true" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-espresso"
                  >
                    <Trash2 width={14} height={14} aria-hidden="true" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit border border-border bg-cream p-7 lg:sticky lg:top-28">
          <h2 className="eyebrow text-muted-foreground">Order summary</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Subtotal" value={formatPKR(totals.subtotal)} />
            {totals.discount > 0 && (
              <Row label={`Discount (${coupon})`} value={`− ${formatPKR(totals.discount)}`} />
            )}
            <Row
              label="Delivery"
              value={totals.delivery === 0 ? "FREE" : formatPKR(totals.delivery)}
            />
            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="eyebrow">Total</dt>
              <dd className="font-display text-2xl">{formatPKR(totals.total)}</dd>
            </div>
          </dl>

          {remainingForFree > 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Add {formatPKR(remainingForFree)} more for free delivery.
            </p>
          ) : (
            <p className="mt-4 text-xs text-gold">You've unlocked free delivery.</p>
          )}

          <div className="mt-6">
            <label htmlFor="coupon" className="eyebrow mb-2 block text-muted-foreground">
              Promo code
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="LUMIERE10"
                className={inputBase}
                autoComplete="off"
              />
              <button type="button" onClick={applyCoupon} className={cn(btnOutline, "px-5")}>
                APPLY
              </button>
            </div>
          </div>

          <Link to="/checkout" className={cn(btnPrimary, "mt-6 w-full")}>
            PROCEED TO CHECKOUT
          </Link>
          <Link to="/shop" className={cn(btnOutline, "mt-3 w-full")}>
            CONTINUE SHOPPING
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
