import { createFileRoute, Link } from "@tanstack/react-router";
import { img } from "@/lib/images";
import { PageHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { btnPrimary } from "@/lib/ui";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Lumière Home" },
      {
        name: "description",
        content:
          "Lumière Home is a Karachi-based decor studio working with artisans across Pakistan to make considered, long-lasting pieces for the home.",
      },
      { property: "og:title", content: "Our Story — Lumière Home" },
      {
        property: "og:description",
        content: "A Karachi decor studio working with artisans across Pakistan.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    title: "Considered, not constant",
    body: "We release small edits a few times a year instead of a new drop every week. Fewer pieces, chosen properly.",
  },
  {
    title: "Made with named hands",
    body: "Our pottery, weaving and embroidery come from workshops in Multan, Hala, Chiniot and Karachi that we visit in person.",
  },
  {
    title: "Built to be kept",
    body: "Solid brass rather than plated. Stoneware rather than resin. Pieces that look better after five years, not worse.",
  },
  {
    title: "Honest about price",
    body: "Prices in PKR, no inflate-and-discount games, and free delivery once your order passes ₨10,000.",
  },
];

const MILESTONES = [
  { year: "2019", text: "A single studio table in Karachi and forty hand-thrown vases." },
  { year: "2021", text: "First artisan partnership in Multan for blue pottery." },
  { year: "2023", text: "The Islamic & Cultural Decor collection launches." },
  { year: "2026", text: "Twenty categories, seventy pieces, delivered nationwide." },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Light, texture and a little patience."
        description="Lumière Home began in 2019 with a small kiln, a large idea, and the belief that a room should feel like the person who lives in it."
      />

      <section className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <img
            src={img("hero-living")}
            alt="The Lumière Home studio: an ivory room layered with vases, art and warm lamplight"
            loading="lazy"
            width={1600}
            height={1100}
            className="aspect-[4/3] w-full object-cover"
          />
        </Reveal>
        <Reveal className="max-w-xl">
          <h2 className="font-display text-4xl">We style rooms, not showrooms.</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Most decor in Pakistan is either imported and impersonal or beautiful but impossible to
            find twice. We wanted a third option: a permanent collection of decorative pieces —
            never furniture — that works in a Karachi apartment, a Lahore family home, or a first
            rented room in Islamabad.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every piece is photographed as you would actually live with it, priced clearly in
            rupees, and backed by a studio you can message directly.
          </p>
          <Link to="/shop" className={btnPrimary + " mt-8"}>
            SHOP THE COLLECTION
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-border bg-cream py-16 md:py-24">
        <div className="shell">
          <h2 className="font-display text-4xl">What we hold to</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Reveal key={v.title} className="border border-border bg-background p-7">
                <h3 className="font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <h2 className="font-display text-4xl">A short timeline</h2>
        <ol className="mt-10 space-y-6 border-l border-border pl-8">
          {MILESTONES.map((m) => (
            <li key={m.year} className="relative">
              <span
                className="absolute -left-[2.15rem] top-2 h-2 w-2 rounded-full bg-gold"
                aria-hidden="true"
              />
              <p className="eyebrow text-gold">{m.year}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell pb-24">
        <div className="flex flex-col items-center border border-border bg-cream px-6 py-16 text-center">
          <h2 className="max-w-xl font-display text-4xl">Styling something specific?</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Tell us the room and the budget — our studio will send an edit back within two working
            days.
          </p>
          <Link to="/contact" className={btnPrimary + " mt-8"}>
            TALK TO THE STUDIO
          </Link>
        </div>
      </section>
    </>
  );
}
