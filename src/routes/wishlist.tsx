import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { img } from "@/lib/images";
import { categoryName, finalPrice, formatPKR, getProduct } from "@/lib/products";
import { moveToCart, removeFromWishlist, useWishlist } from "@/lib/store";
import { EmptyState } from "@/components/site/EmptyState";
import { Stars } from "@/components/site/Stars";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Lumière Home" },
      { name: "description", content: "The Lumière Home pieces you've saved for later." },
      { property: "og:title", content: "Your Wishlist — Lumière Home" },
      { property: "og:description", content: "Saved decor pieces, ready when you are." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist();
  const products = ids.map(getProduct).filter((p) => !!p);

  return (
    <div className="shell py-16 md:py-24">
      <h1 className="font-display text-5xl">Your Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length} saved piece{products.length === 1 ? "" : "s"}
      </p>

      <div className="mt-10">
        {products.length === 0 ? (
          <EmptyState
            icon={<Heart width={28} height={28} />}
            title="Save pieces you love and find them here later."
            description="Tap the heart on any product to keep it close."
            actionLabel="DISCOVER DECOR"
            actionTo="/shop"
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id} className="flex gap-4 border border-border bg-card p-4">
                <Link to="/product/$id" params={{ id: p.id }} className="w-28 flex-none">
                  <img
                    src={img(p.imageKey)}
                    alt={p.name}
                    loading="lazy"
                    width={320}
                    height={400}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="eyebrow text-muted-foreground">{categoryName(p.category)}</p>
                  <h2 className="mt-1 font-display text-lg leading-snug">
                    <Link to="/product/$id" params={{ id: p.id }} className="hover:text-gold">
                      {p.name}
                    </Link>
                  </h2>
                  <div className="mt-1">
                    <Stars rating={p.rating} reviews={p.reviews} />
                  </div>
                  <p className="mt-2 text-sm">{formatPKR(finalPrice(p))}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <button
                      type="button"
                      disabled={!p.inStock}
                      onClick={() => moveToCart(p.id)}
                      className={cn(btnPrimary, "px-4 py-2.5 text-[0.62rem]")}
                    >
                      {p.inStock ? "MOVE TO CART" : "SOLD OUT"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(p.id)}
                      aria-label={`Remove ${p.name} from wishlist`}
                      className="flex h-9 w-9 items-center justify-center border border-border hover:border-espresso"
                    >
                      <Trash2 width={14} height={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {products.length > 0 && (
        <div className="mt-12">
          <Link to="/shop" className={btnOutline}>
            CONTINUE SHOPPING
          </Link>
        </div>
      )}
    </div>
  );
}
