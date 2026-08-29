import { createFileRoute, Link } from "@tanstack/react-router";
import { img } from "@/lib/images";
import { ROOMS, getProduct } from "@/lib/products";
import { PageHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProductGrid } from "@/components/site/ProductCard";
import { btnOutline } from "@/lib/ui";

export const Route = createFileRoute("/inspiration")({
  head: () => ({
    meta: [
      { title: "Inspiration & Styling Journal — Lumière Home" },
      {
        name: "description",
        content:
          "Styling stories and room edits from the Lumière Home studio: layering light, decorating a rented apartment, and building a calm bedroom.",
      },
      { property: "og:title", content: "Inspiration — Lumière Home" },
      {
        property: "og:description",
        content: "Room edits and styling notes from our Karachi studio.",
      },
    ],
  }),
  component: InspirationPage,
});

const STORIES = [
  {
    imageKey: "room-living",
    eyebrow: "Styling notes",
    title: "Three lamps beat one ceiling light",
    body: "The fastest way to make a living room feel expensive is to switch the ceiling light off. Layer a table lamp, a floor-level lantern and one candle instead — three warm pools of light at different heights.",
    room: "living",
  },
  {
    imageKey: "room-bedroom",
    eyebrow: "Room edit",
    title: "A bedroom that lowers your shoulders",
    body: "Keep the palette to three tones, put texture where you touch things, and leave one surface completely empty. Calm is mostly restraint.",
    room: "bedroom",
  },
  {
    imageKey: "entryway",
    eyebrow: "Small spaces",
    title: "Renting? Decorate the walls anyway",
    body: "Leaning art, adhesive hooks and macramé hangings give a rented flat a personality you can pack into a box on moving day.",
    room: "entrance",
  },
  {
    imageKey: "room-dining",
    eyebrow: "Hosting",
    title: "A dinner table in five pieces",
    body: "One runner, one low centerpiece, two candle holders and a bowl for whatever the season is offering. Anything taller blocks conversation.",
    room: "dining",
  },
];

const LOOK_IDS = ["lh-001", "lh-015", "lh-027", "lh-031"];

function InspirationPage() {
  const lookProducts = LOOK_IDS.map(getProduct).filter((p) => !!p);

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Inspiration, from our studio to your rooms."
        description="Short, practical styling notes — the things we actually tell customers when they send us a photo of their space."
      />

      <section className="shell space-y-20 py-16 md:py-24">
        {STORIES.map((s, i) => (
          <Reveal
            key={s.title}
            className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <img
              src={img(s.imageKey)}
              alt={s.title}
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="max-w-lg">
              <p className="eyebrow text-gold">{s.eyebrow}</p>
              <h2 className="mt-3 font-display text-4xl">{s.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <Link to="/shop" search={{ room: s.room }} className={btnOutline + " mt-7"}>
                SHOP THIS ROOM
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-border bg-cream py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold">The edit</p>
          <h2 className="mt-3 font-display text-4xl">Pieces behind these stories</h2>
          <Reveal className="mt-10">
            <ProductGrid products={lookProducts} />
          </Reveal>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <p className="eyebrow text-gold">Keep browsing</p>
        <h2 className="mt-3 font-display text-4xl">Pick a room to style next</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {ROOMS.map((r) => (
            <Link
              key={r.slug}
              to="/shop"
              search={{ room: r.slug }}
              className="border border-border px-5 py-3 text-xs uppercase tracking-[0.16em] transition-colors hover:border-espresso"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
