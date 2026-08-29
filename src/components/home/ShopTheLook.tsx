import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { img } from "@/lib/images";
import { SHOP_THE_LOOK, finalPrice, formatPKR, getProduct } from "@/lib/products";
import { addToCart, notify } from "@/lib/store";
import { btnPrimary, btnOutline } from "@/lib/ui";
import { SectionHeader } from "@/components/site/Section";

export function ShopTheLook() {
  const [active, setActive] = useState<string | null>(null);
  const hotspots = SHOP_THE_LOOK.filter((h) => getProduct(h.productId));
  const lookTotal = hotspots.reduce(
    (sum, h) => sum + finalPrice(getProduct(h.productId)!),
    0,
  );

  const addWholeLook = () => {
    hotspots.forEach((h) => addToCart(h.productId, 1, true));
    notify(`${hotspots.length} pieces from the look added to cart`, "success");
  };

  return (
    <section className="shell py-20 md:py-28">
      <SectionHeader
        eyebrow="Shop the look"
        title="One room, five decisions."
        description="Tap a marker to see the piece, or take the whole arrangement home."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden bg-cream">
          <img
            src={img("shop-the-look")}
            alt="Styled living room corner with a ceramic vase, framed art, brass lamp, linen cushion and a wool rug"
            loading="lazy"
            width={1600}
            height={1104}
            className="h-full w-full object-cover"
          />
          {hotspots.map((h, index) => {
            const product = getProduct(h.productId)!;
            const isActive = active === h.id;
            return (
              <div key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <button
                  type="button"
                  onClick={() => setActive(isActive ? null : h.id)}
                  aria-expanded={isActive}
                  aria-label={`Hotspot ${index + 1}: ${product.name}`}
                  className="flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-espresso/85 text-ivory transition hover:scale-110"
                >
                  {isActive ? <X width={14} height={14} /> : <Plus width={14} height={14} />}
                </button>

                {isActive ? (
                  <div className="lum-reveal is-visible absolute left-1/2 top-6 z-10 w-60 -translate-x-1/2 border border-border bg-background p-3 shadow-xl">
                    <div className="flex gap-3">
                      <img
                        src={img(product.imageKey)}
                        alt={product.name}
                        loading="lazy"
                        width={64}
                        height={64}
                        className="h-16 w-16 flex-none object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-display text-base">{product.name}</p>
                        <p className="text-sm">{formatPKR(finalPrice(product))}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/product/$id"
                        params={{ id: product.id }}
                        className="flex-1 border border-espresso px-2 py-2 text-center text-[0.6rem] tracking-[0.18em] hover:bg-espresso hover:text-ivory"
                      >
                        VIEW
                      </Link>
                      <button
                        type="button"
                        onClick={() => addToCart(product.id)}
                        className="flex-1 border border-espresso bg-espresso px-2 py-2 text-[0.6rem] tracking-[0.18em] text-ivory hover:bg-transparent hover:text-espresso"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-center border border-border bg-cream p-7">
          <p className="eyebrow text-gold">The pieces</p>
          <ul className="mt-5 divide-y divide-border">
            {hotspots.map((h) => {
              const product = getProduct(h.productId)!;
              return (
                <li key={h.id} className="flex items-center justify-between gap-4 py-3">
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    className="min-w-0 flex-1 truncate text-sm hover:text-gold"
                    onMouseEnter={() => setActive(h.id)}
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {formatPKR(finalPrice(product))}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
            <span className="eyebrow text-muted-foreground">Look total</span>
            <span className="font-display text-2xl">{formatPKR(lookTotal)}</span>
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={addWholeLook} className={btnPrimary}>
              SHOP THIS LOOK
            </button>
            <Link to="/rooms" className={btnOutline}>
              EXPLORE ROOMS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
