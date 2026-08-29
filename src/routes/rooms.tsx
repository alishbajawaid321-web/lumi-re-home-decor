import { createFileRoute, Link } from "@tanstack/react-router";
import { AVAILABLE_ROOMS, productsByRoom } from "@/lib/products";
import { RoomCard } from "@/components/site/Cards";
import { ProductGrid } from "@/components/site/ProductCard";
import { PageHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Shop by Room — Lumière Home" },
      {
        name: "description",
        content:
          "Decor curated room by room: living room, bedroom, dining, bathroom, kids room, balcony, entrance and home office.",
      },
      { property: "og:title", content: "Shop by Room — Lumière Home" },
      {
        property: "og:description",
        content: "Find decorative pieces chosen for the room you're styling.",
      },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Room by room"
        title="Style the room you actually live in."
        description="Each edit is decor only — art, light, texture and scent. No furniture."
      />

      <section className="shell py-16">
        <Reveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {AVAILABLE_ROOMS.map((r) => (
            <RoomCard key={r.slug} room={r} />
          ))}
        </Reveal>
      </section>

      {AVAILABLE_ROOMS.map((room) => {
        const products = productsByRoom(room.slug).slice(0, 4);
        if (products.length === 0) return null;
        return (
          <section key={room.slug} className="shell border-t border-border py-16">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-gold">{room.blurb}</p>
                <h2 className="mt-2 font-display text-4xl">{room.name}</h2>
              </div>
              <Link
                to="/shop"
                search={{ room: room.slug }}
                className="eyebrow border-b border-espresso pb-1 hover:border-gold hover:text-gold"
              >
                SHOP {room.name.toUpperCase()}
              </Link>
            </div>
            <Reveal className="mt-10">
              <ProductGrid products={products} />
            </Reveal>
          </section>
        );
      })}
    </>
  );
}
