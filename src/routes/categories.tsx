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
  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Every category, considered."
        description="Twenty decorative categories — no furniture, only the pieces that give a room its character."
      />
      <section className="shell py-16 md:py-20">
        <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div key={c.slug}>
              <CategoryCard category={c} />
              <p className="mt-2 text-xs text-muted-foreground">
                {productsByCategory(c.slug).length} pieces
              </p>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
