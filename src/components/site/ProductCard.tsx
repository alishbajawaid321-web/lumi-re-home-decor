import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { img } from "@/lib/images";
import { categoryName, finalPrice, formatPKR, type Product } from "@/lib/products";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/store";
import { Stars } from "./Stars";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const wishlist = useWishlist();
  const saved = wishlist.includes(product.id);
  const price = finalPrice(product);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden bg-cream">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block aspect-[4/5] w-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={img(product.imageKey)}
            alt={product.name}
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {product.discount ? (
          <span className="absolute left-0 top-3 bg-espresso px-2.5 py-1 text-[0.65rem] tracking-[0.18em] text-ivory">
            −{product.discount}%
          </span>
        ) : null}
        {!product.inStock && (
          <span className="absolute left-0 top-3 bg-muted px-2.5 py-1 text-[0.65rem] tracking-[0.18em] text-muted-foreground">
            SOLD OUT
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition hover:bg-background"
        >
          <Heart
            width={16}
            height={16}
            className={cn("transition", saved && "lum-pop fill-burgundy text-burgundy")}
          />
        </button>

        {product.inStock && (
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-espresso/95 py-3 text-[0.7rem] tracking-[0.22em] text-ivory transition-transform duration-300 group-hover:translate-y-0 focus-visible:translate-y-0"
          >
            <Plus width={14} height={14} aria-hidden="true" /> QUICK ADD
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <p className="eyebrow text-muted-foreground">{categoryName(product.category)}</p>
        <h3 className="font-display text-xl leading-snug">
          <Link to="/product/$id" params={{ id: product.id }} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-medium">{formatPKR(price)}</span>
          {product.discount ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPKR(product.price)}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
