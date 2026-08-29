import { Link } from "@tanstack/react-router";
import { img } from "@/lib/images";
import type { Category, Room } from "@/lib/products";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/shop"
      search={{ category: category.slug }}
      className="group relative block overflow-hidden bg-cream"
    >
      <img
        src={img(category.imageKey)}
        alt={category.name}
        loading="lazy"
        width={1200}
        height={900}
        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="block font-display text-2xl text-ivory">{category.name}</span>
        <span className="mt-1 block text-xs text-ivory/80">{category.blurb}</span>
      </span>
    </Link>
  );
}

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to="/shop"
      search={{ room: room.slug }}
      className="group relative block overflow-hidden bg-cream"
    >
      <img
        src={img(room.imageKey)}
        alt={room.name}
        loading="lazy"
        width={1200}
        height={900}
        className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/5 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="eyebrow block text-ivory/70">Shop by room</span>
        <span className="mt-1 block font-display text-2xl text-ivory">{room.name}</span>
      </span>
    </Link>
  );
}
