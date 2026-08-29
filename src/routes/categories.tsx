import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, productsByCategory } from "@/lib/products";
import { CategoryCard } from "@/components/site/Cards";
import { PageHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Lumière Home Decor" },
      {
        name: "description",
        content:
          "Twenty curated decor categories: wall art, showpieces, lighting, candles, mirrors, rugs, vases, Islamic decor, handmade pieces and more.",
      },
      { property: "og:title", content: "All Categories — Lumière Home" },
      {
        property: "og:description",
        content: "Browse twenty curated categories of luxury home decor.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const featured = CATEGORIES.slice(0, 3);
  const rest = CATEGORIES.slice(3);

  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Every category, considered."
        description="Twenty decorative categories — no furniture, only the pieces that give a room its character."
      />

      <section className="shell pb-10 pt-6 md:pb-16">
        <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <div key={c.slug} className="min-w-0">
              <CategoryCard category={c} />
              <p className="mt-3 text-xs tracking-[0.16em] text-muted-foreground">
                {productsByCategory(c.slug).length} PIECES
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="shell border-t border-border py-12 md:py-16">
        <p className="eyebrow text-gold">The full index</p>
        <Reveal className="mt-8 grid gap-x-14 sm:grid-cols-2">
          {rest.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-5 transition-colors hover:border-espresso"
            >
              <span className="text-xs tracking-[0.18em] text-muted-foreground">
                {String(i + 4).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-2xl leading-tight transition-colors group-hover:text-gold">
                  {c.name}
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">{c.blurb}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {productsByCategory(c.slug).length}
              </span>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}

