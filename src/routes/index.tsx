import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { img } from "@/lib/images";
import {
  AVAILABLE_CATEGORIES,
  AVAILABLE_ROOMS,
  bestSellers,
  handmadeCollection,
  luxuryCollection,
  newArrivals,
} from "@/lib/products";
import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeader } from "@/components/site/Section";
import { CategoryCard, RoomCard } from "@/components/site/Cards";
import { Reveal } from "@/components/site/Reveal";
import { ShopTheLook } from "@/components/home/ShopTheLook";
import { BudgetDecorator } from "@/components/home/BudgetDecorator";
import { btnLight, btnOutline } from "@/lib/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière Home — Elevate Your Space | Luxury Home Decor" },
      {
        name: "description",
        content:
          "Curated luxury home decor in Pakistan: wall art, brass lighting, candles, vases, mirrors, rugs and handmade pieces. Free delivery over ₨10,000.",
      },
      { property: "og:title", content: "Lumière Home — Elevate Your Space" },
      {
        property: "og:description",
        content:
          "Thoughtfully curated decor for homes that tell a story. Shop wall art, lighting, candles and handmade pieces.",
      },
    ],
  }),
  component: HomePage,
});

const REVIEWS = [
  {
    name: "Hira A.",
    city: "Karachi",
    text: "The brass lamp completely changed our living room in the evenings. Packaging was as considered as the piece itself.",
  },
  {
    name: "Bilal R.",
    city: "Lahore",
    text: "I ordered the Ayat al-Kursi frame for my parents. The print quality and the framing are far better than I expected.",
  },
  {
    name: "Sana M.",
    city: "Islamabad",
    text: "The budget decorator picked a set for my bedroom under ₨25,000 and honestly it looks like a magazine shoot now.",
  },
  {
    name: "Ayesha K.",
    city: "Multan",
    text: "Hand-thrown vase arrived perfectly wrapped. You can feel that it's actually made by hand.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[82vh] min-h-[32rem] w-full overflow-hidden">
          <img
            src={img("hero-living")}
            alt="A sunlit ivory living room with sculptural vases, arched mirror and warm brass lighting"
            width={1920}
            height={1088}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/25 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="shell">
              <div className="max-w-xl">
                <p className="eyebrow text-ivory/80">Lumière Home</p>
                <h1 className="mt-5 font-display text-6xl text-ivory md:text-8xl">
                  Elevate Your Space.
                </h1>
                <p className="mt-5 max-w-md text-sm text-ivory/85 md:text-base">
                  Thoughtfully curated decor for homes that tell a story.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to="/shop" className={btnLight}>
                    SHOP COLLECTION
                  </Link>
                  <Link
                    to="/rooms"
                    className={btnOutline + " border-ivory text-ivory hover:bg-ivory hover:text-espresso"}
                  >
                    EXPLORE ROOMS
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <a
            href="#new-arrivals"
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/80 transition hover:text-ivory"
            aria-label="Scroll to new arrivals"
          >
            <span className="eyebrow text-[0.55rem]">Scroll</span>
            <ChevronDown width={18} height={18} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* New arrivals */}
      <section id="new-arrivals" className="shell scroll-mt-24 py-20 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Just landed"
            title="New Arrivals"
            description="The newest additions to the collection, chosen for texture and quiet detail."
            action={{ label: "VIEW ALL", to: "/shop", search: { sort: "newest" } }}
          />
        </Reveal>
        <Reveal className="mt-12">
          <ProductGrid products={newArrivals(8)} />
        </Reveal>
      </section>

      {/* Shop by category */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Browse"
            title="Shop by Category"
            description="Twenty considered categories, from wall art to handmade pottery."
            action={{ label: "ALL CATEGORIES", to: "/categories" }}
          />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AVAILABLE_CATEGORIES.slice(0, 8).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </Reveal>
      </section>

      {/* Shop by room */}
      <section className="border-y border-border bg-cream py-20 md:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeader
              eyebrow="Room by room"
              title="Shop by Room"
              description="Start where you actually spend your evenings."
              action={{ label: "ALL ROOMS", to: "/rooms" }}
            />
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {AVAILABLE_ROOMS.map((r) => (
              <RoomCard key={r.slug} room={r} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Best sellers */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Loved most"
            title="Best Sellers"
            description="The pieces our customers come back for."
            action={{ label: "VIEW ALL", to: "/shop", search: { collection: "best" } }}
          />
        </Reveal>
        <Reveal className="mt-12">
          <ProductGrid products={bestSellers(8)} />
        </Reveal>
      </section>

      <ShopTheLook />
      <BudgetDecorator />

      {/* Luxury collection */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="The Luxury Collection"
            title="Pieces with weight."
            description="Marble, solid brass and hand-knotted wool — the anchors of a considered room."
            action={{ label: "VIEW COLLECTION", to: "/shop", search: { collection: "luxury" } }}
          />
        </Reveal>
        <Reveal className="mt-12">
          <ProductGrid products={luxuryCollection(4)} />
        </Reveal>
      </section>

      {/* Handmade */}
      <section className="border-y border-border bg-cream py-20 md:py-28">
        <div className="shell">
          <Reveal>
            <SectionHeader
              eyebrow="The Handmade Collection"
              title="Made slowly, by hand."
              description="Small-batch pottery, weaving and embroidery from artisans across Pakistan."
              action={{ label: "VIEW COLLECTION", to: "/shop", search: { collection: "handmade" } }}
            />
          </Reveal>
          <Reveal className="mt-12">
            <ProductGrid products={handmadeCollection(4)} />
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHeader eyebrow="Kind words" title="From homes across Pakistan" />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="border border-border bg-card p-7">
              <p className="text-gold" aria-label="Rated 5 out of 5">
                ★★★★★
              </p>
              <blockquote className="mt-4 font-display text-xl leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {r.name} — {r.city}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>
    </>
  );
}
