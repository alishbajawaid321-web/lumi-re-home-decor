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
  const imageKey = product.gallery.length > 1
    ? product.gallery[product.id.charCodeAt(product.id.length - 1) % product.gallery.length]
    : product.imageKey;

  return (
    <article className={cn("group relative flex min-w-0 flex-col", className)}>
      <div className="relative overflow-hidden rounded-md bg-cream ring-1 ring-border/60 transition-shadow duration-500 group-hover:shadow-lg">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block aspect-[4/5] w-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={img(imageKey ?? product.imageKey)}
            alt={product.name}
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        </Link>

        {product.discount ? (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal/90 px-2.5 py-1 text-[0.6rem] tracking-[0.16em] text-ivory backdrop-blur-sm">
            −{product.discount}%
          </span>
        ) : null}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.6rem] tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
            SOLD OUT
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-gold hover:text-gold"
        >
          <Heart
            width={16}
            height={16}
            className={cn("transition", saved && "lum-pop fill-gold text-gold")}
          />
        </button>

        {product.inStock && (
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="absolute inset-x-3 bottom-3 flex min-h-10 items-center justify-center gap-2 rounded-full bg-charcoal/95 px-3 py-2.5 text-[0.65rem] tracking-[0.18em] text-ivory shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-gold focus-visible:bg-gold md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
          >
            <Plus width={14} height={14} aria-hidden="true" /> QUICK ADD
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-4">
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-gold">{categoryName(product.category)}</p>
        <h3 className="font-display text-lg leading-snug sm:text-xl">
          <Link to="/product/$id" params={{ id: product.id }} className="transition-colors hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium text-charcoal sm:text-base">{formatPKR(price)}</span>
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
        "grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
