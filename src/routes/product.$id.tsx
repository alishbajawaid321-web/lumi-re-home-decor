import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Heart, Minus, Plus, Truck } from "lucide-react";
import { img } from "@/lib/images";
import {
  categoryName,
  finalPrice,
  formatPKR,
  getProduct,
  relatedProducts,
  roomName,
} from "@/lib/products";
import { addToCart, recordView, toggleWishlist, useWishlist } from "@/lib/store";
import { Stars } from "@/components/site/Stars";
import { ProductGrid } from "@/components/site/ProductCard";
import { EmptyState } from "@/components/site/EmptyState";
import { SectionHeader } from "@/components/site/Section";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) {
      return {
        meta: [
          { title: "Product Not Found — Lumière Home" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${product.name} — Lumière Home`;
    const description = product.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQty(1);
    setActiveImage(0);
    if (product) recordView(product.id);
  }, [product]);

  if (!product) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="Product Not Found"
          as="h1"
          description="This piece may have sold out or the link is incorrect. The rest of the collection is waiting."
          actionLabel="BACK TO SHOP"
          actionTo="/shop"
        />
      </div>
    );
  }

  const price = finalPrice(product);
  const saved = wishlist.includes(product.id);
  const gallery = product.gallery.length ? product.gallery : [product.imageKey];

  const buyNow = () => {
    addToCart(product.id, qty, true);
    void navigate({ to: "/checkout" });
  };

  return (
    <div className="pb-24">
      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-espresso">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop" className="hover:text-espresso">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/shop"
                search={{ category: product.category }}
                className="hover:text-espresso"
              >
                {categoryName(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>
      </div>

      <div className="shell mt-8 grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden bg-cream">
            <img
              src={img(gallery[activeImage] ?? product.imageKey)}
              alt={`${product.name} — view ${activeImage + 1}`}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((key, i) => (
                <button
                  key={`${key}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={activeImage === i}
                  className={cn(
                    "overflow-hidden border transition-colors",
                    activeImage === i ? "border-espresso" : "border-transparent hover:border-border",
                  )}
                >
                  <img
                    src={img(key)}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    loading="lazy"
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow text-gold">{categoryName(product.category)}</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-4">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>

          <p className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl">{formatPKR(price)}</span>
            {product.discount ? (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPKR(product.price)}
                </span>
                <span className="bg-espresso px-2 py-1 text-[0.65rem] tracking-[0.18em] text-ivory">
                  SAVE {product.discount}%
                </span>
              </>
            ) : null}
          </p>

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                product.inStock ? "bg-gold" : "bg-muted-foreground",
              )}
              aria-hidden="true"
            />
            {product.inStock ? "In stock — ready to ship" : "Currently sold out"}
          </p>

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center hover:bg-cream"
                aria-label="Decrease quantity"
              >
                <Minus width={15} height={15} />
              </button>
              <span className="w-12 text-center text-sm" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="flex h-12 w-12 items-center justify-center hover:bg-cream"
                aria-label="Increase quantity"
              >
                <Plus width={15} height={15} />
              </button>
            </div>

            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => addToCart(product.id, qty)}
              className={cn(btnPrimary, "flex-1 min-w-[12rem]")}
            >
              ADD TO CART
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-4">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={buyNow}
              className={cn(btnOutline, "flex-1 min-w-[12rem]")}
            >
              BUY NOW
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={saved}
              className={cn(btnOutline, "flex-1 min-w-[12rem]")}
            >
              <Heart
                width={15}
                height={15}
                className={cn(saved && "fill-burgundy text-burgundy")}
                aria-hidden="true"
              />
              {saved ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>

          <ul className="mt-8 space-y-2 border-y border-border py-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck width={15} height={15} className="text-gold" aria-hidden="true" /> Free delivery
              on orders over ₨10,000 — otherwise ₨250
            </li>
            <li className="flex items-center gap-3">
              <Check width={15} height={15} className="text-gold" aria-hidden="true" /> 7-day easy
              returns · Cash on delivery available
            </li>
          </ul>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <Detail label="Material" value={product.material} />
            <Detail label="Colour" value={product.color} />
            <Detail label="Style" value={product.style} />
            <Detail label="Dimensions" value={product.dimensions} />
            <Detail label="Subcategory" value={product.subcategory} />
            <Detail label="Product code" value={product.id.toUpperCase()} />
            <Detail label="Styled for" value={product.rooms.map(roomName).join(", ")} />
            <Detail label="Tags" value={product.tags.join(", ")} />
          </dl>
        </div>
      </div>

      <section className="shell mt-24">
        <SectionHeader eyebrow="Completes the look" title="You may also like" />
        <div className="mt-10">
          <ProductGrid products={relatedProducts(product, 4)} />
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
