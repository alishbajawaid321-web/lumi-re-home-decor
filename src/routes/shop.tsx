import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import {
  ALL_COLORS,
  ALL_MATERIALS,
  ALL_STYLES,
  AVAILABLE_CATEGORIES,
  availableSubcategories,
  isCategoryAvailable,
  isRoomAvailable,
  PRICE_MAX,
  PRODUCTS,
  AVAILABLE_ROOMS,
  categoryName,
  finalPrice,
  formatPKR,
  roomName,
  searchProducts,
  type Product,
} from "@/lib/products";
import { ProductGrid } from "@/components/site/ProductCard";
import { EmptyState } from "@/components/site/EmptyState";
import { btnGhost, btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  subcategory?: string | undefined;
  room?: string | undefined;
  color?: string | undefined;
  material?: string | undefined;
  style?: string | undefined;
  sort?: string | undefined;
  collection?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  rating?: number | undefined;
  inStock?: boolean | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && v !== "" && v !== null && v !== undefined ? n : undefined;
};

/** Only keep taxonomy values that actually have available products. */
const validCategory = (v: unknown) => {
  const slug = str(v);
  return slug && isCategoryAvailable(slug) ? slug : undefined;
};
const validSubcategory = (c: unknown, v: unknown) => {
  const cat = validCategory(c);
  const sub = str(v);
  return cat && sub && availableSubcategories(cat).includes(sub) ? sub : undefined;
};
const validRoom = (v: unknown) => {
  const slug = str(v);
  return slug && isRoomAvailable(slug) ? slug : undefined;
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

const COLLECTIONS = [
  { value: "best", label: "Best Sellers" },
  { value: "new", label: "New Arrivals" },
  { value: "luxury", label: "Luxury" },
  { value: "handmade", label: "Handmade" },
  { value: "sale", label: "On Sale" },
];

const PRICE_BANDS = [
  { label: "Under ₨5,000", min: 0, max: 5000 },
  { label: "₨5,000 – ₨10,000", min: 5000, max: 10000 },
  { label: "₨10,000 – ₨25,000", min: 10000, max: 25000 },
  { label: "₨25,000 – ₨50,000", min: 25000, max: 50000 },
  { label: "Over ₨50,000", min: 50000, max: PRICE_MAX },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: str(search["q"]),
    category: validCategory(search["category"]),
    subcategory: validSubcategory(search["category"], search["subcategory"]),
    room: validRoom(search["room"]),
    color: str(search["color"]),
    material: str(search["material"]),
    style: str(search["style"]),
    sort: str(search["sort"]),
    collection: str(search["collection"]),
    minPrice: num(search["minPrice"]),
    maxPrice: num(search["maxPrice"]),
    rating: num(search["rating"]),
    inStock: search["inStock"] === true || search["inStock"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Decor — Lumière Home" },
      {
        name: "description",
        content:
          "Browse the full Lumière Home collection: wall art, lighting, candles, vases, mirrors, rugs and more. Filter by room, colour, material and price in PKR.",
      },
      { property: "og:title", content: "Shop All Decor — Lumière Home" },
      {
        property: "og:description",
        content: "Filter, sort and discover luxury decor pieces delivered across Pakistan.",
      },
    ],
  }),
  component: ShopPage,
});

function applyFilters(s: ShopSearch): Product[] {
  let list: Product[] = s.q ? searchProducts(s.q) : [...PRODUCTS];

  if (s.category) list = list.filter((p) => p.category === s.category);
  if (s.subcategory) list = list.filter((p) => p.subcategory === s.subcategory);
  if (s.room) list = list.filter((p) => p.rooms.includes(s.room!));
  if (s.color) list = list.filter((p) => p.color === s.color);
  if (s.material)
    list = list.filter((p) => p.material.toLowerCase().includes(s.material!.toLowerCase()));
  if (s.style) list = list.filter((p) => p.style === s.style);
  if (s.rating) list = list.filter((p) => p.rating >= s.rating!);
  if (s.inStock) list = list.filter((p) => p.inStock);
  if (s.minPrice !== undefined) list = list.filter((p) => finalPrice(p) >= s.minPrice!);
  if (s.maxPrice !== undefined) list = list.filter((p) => finalPrice(p) <= s.maxPrice!);

  switch (s.collection) {
    case "best":
      list = list.filter((p) => p.isBestSeller);
      break;
    case "new":
      list = list.filter((p) => p.isNew);
      break;
    case "luxury":
      list = list.filter((p) => p.isLuxury);
      break;
    case "handmade":
      list = list.filter((p) => p.isHandmade);
      break;
    case "sale":
      list = list.filter((p) => !!p.discount);
      break;
    default:
      break;
  }

  const sorted = [...list];
  switch (s.sort) {
    case "price-asc":
      sorted.sort((a, b) => finalPrice(a) - finalPrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => finalPrice(b) - finalPrice(a));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case "popular":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "newest":
      sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id.localeCompare(a.id));
      break;
    case "featured":
    default:
      if (!s.q) {
        sorted.sort(
          (a, b) =>
            Number(!!b.isBestSeller) - Number(!!a.isBestSeller) || b.popularity - a.popularity,
        );
      }
      break;
  }
  return sorted;
}

const PAGE_SIZE = 16;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => applyFilters(search), [search]);

  const update = (patch: Partial<ShopSearch>) => {
    setVisible(PAGE_SIZE);
    void navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });
  };

  const clearAll = () => {
    setVisible(PAGE_SIZE);
    void navigate({ to: ".", search: {} });
  };

  const activeChips = [
    search.q && { label: `“${search.q}”`, clear: { q: undefined } },
    search.category && {
      label: categoryName(search["category"]),
      clear: { category: undefined, subcategory: undefined },
    },
    search.subcategory && { label: search.subcategory, clear: { subcategory: undefined } },
    search.room && { label: roomName(search["room"]), clear: { room: undefined } },
    search.color && { label: search.color, clear: { color: undefined } },
    search.material && { label: search.material, clear: { material: undefined } },
    search.style && { label: search.style, clear: { style: undefined } },
    search.rating && { label: `${search.rating}★ & up`, clear: { rating: undefined } },
    search.inStock && { label: "In stock", clear: { inStock: undefined } },
    (search.minPrice !== undefined || search.maxPrice !== undefined) && {
      label: `${formatPKR(search.minPrice ?? 0)} – ${formatPKR(search.maxPrice ?? PRICE_MAX)}`,
      clear: { minPrice: undefined, maxPrice: undefined },
    },
    search.collection && {
      label: COLLECTIONS.find((c) => c.value === search["collection"])?.label ?? search.collection,
      clear: { collection: undefined },
    },
  ].filter(Boolean) as unknown as { label: string; clear: Partial<ShopSearch> }[];

  const filters = <Filters search={search} update={update} clearAll={clearAll} />;

  return (
    <div className="shell py-12 md:py-16">
      <header>
        <p className="eyebrow text-gold">The collection</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">
          {search.q
            ? `Results for “${search.q}”`
            : search.category
              ? categoryName(search["category"])
              : search.room
                ? `${roomName(search["room"])} Decor`
                : "Shop All Decor"}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {results.length} piece{results.length === 1 ? "" : "s"} · Free delivery over ₨10,000
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cn(btnGhost, "lg:hidden")}
            >
              <SlidersHorizontal width={15} height={15} aria-hidden="true" /> FILTERS
              {activeChips.length ? ` (${activeChips.length})` : ""}
            </button>

            <label className="ml-auto flex items-center gap-3 text-xs">
              <span className="eyebrow text-muted-foreground">Sort</span>
              <select
                value={search.sort ?? "featured"}
                onChange={(e) => update({ sort: e.target.value })}
                className="border border-border bg-card px-3 py-2 text-xs focus:border-gold focus:outline-none"
              >
                {SORTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => update(chip.clear)}
                  className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs hover:border-espresso"
                >
                  {chip.label}
                  <X width={12} height={12} aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-4 hover:text-espresso"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="mt-8">
            {results.length === 0 ? (
              <EmptyState
                title="We couldn't find anything matching your search."
                description="Try fewer filters, or explore the full collection."
                actionLabel="VIEW ALL DECOR"
                onAction={clearAll}
              />
            ) : (
              <>
                <ProductGrid products={results.slice(0, visible)} />
                {visible < results.length && (
                  <div className="mt-14 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className={btnPrimary}
                    >
                      LOAD MORE
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn("fixed inset-0 z-[65] lg:hidden", drawerOpen ? "" : "pointer-events-none")}
        aria-hidden={!drawerOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-charcoal/40 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(90vw,22rem)] flex-col bg-background transition-transform duration-300",
            drawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="eyebrow">Filters</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="flex h-9 w-9 items-center justify-center"
            >
              <X width={18} height={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
          <div className="border-t border-border p-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className={cn(btnPrimary, "w-full")}
            >
              SHOW {results.length} RESULTS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Filters({
  search,
  update,
  clearAll,
}: {
  search: ShopSearch;
  update: (patch: Partial<ShopSearch>) => void;
  clearAll: () => void;
}) {
  const subcategories = search.category ? availableSubcategories(search["category"]) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted-foreground">Refine</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-4 hover:text-espresso"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Collection">
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.map((c) => (
            <Chip
              key={c.value}
              active={search["collection"] === c.value}
              onClick={() =>
                update({ collection: search["collection"] === c.value ? undefined : c.value })
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Category">
        <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1 text-sm">
          {AVAILABLE_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() =>
                  update({
                    category: search["category"] === c.slug ? undefined : c.slug,
                    subcategory: undefined,
                  })
                }
                className={cn(
                  "text-left transition-colors hover:text-gold",
                  search["category"] === c.slug ? "text-gold" : "text-foreground/80",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterGroup>

      {subcategories.length > 0 && (
        <FilterGroup title="Subcategory">
          <div className="flex flex-wrap gap-2">
            {subcategories.map((s) => (
              <Chip
                key={s}
                active={search["subcategory"] === s}
                onClick={() => update({ subcategory: search["subcategory"] === s ? undefined : s })}
              >
                {s}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Room">
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_ROOMS.map((r) => (
            <Chip
              key={r.slug}
              active={search["room"] === r.slug}
              onClick={() => update({ room: search["room"] === r.slug ? undefined : r.slug })}
            >
              {r.name}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex flex-col gap-2">
          {PRICE_BANDS.map((b) => {
            const active = search["minPrice"] === b.min && search["maxPrice"] === b.max;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() =>
                  update(
                    active
                      ? { minPrice: undefined, maxPrice: undefined }
                      : { minPrice: b.min, maxPrice: b.max },
                  )
                }
                className={cn(
                  "text-left text-sm transition-colors hover:text-gold",
                  active ? "text-gold" : "text-foreground/80",
                )}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <Chip
              key={c}
              active={search["color"] === c}
              onClick={() => update({ color: search["color"] === c ? undefined : c })}
            >
              {c}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Material">
        <div className="flex flex-wrap gap-2">
          {ALL_MATERIALS.map((m) => (
            <Chip
              key={m}
              active={search["material"] === m}
              onClick={() => update({ material: search["material"] === m ? undefined : m })}
            >
              {m}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Style">
        <div className="flex flex-wrap gap-2">
          {ALL_STYLES.map((s) => (
            <Chip
              key={s}
              active={search["style"] === s}
              onClick={() => update({ style: search["style"] === s ? undefined : s })}
            >
              {s}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="flex flex-wrap gap-2">
          {[4.5, 4, 3.5].map((r) => (
            <Chip
              key={r}
              active={search["rating"] === r}
              onClick={() => update({ rating: search["rating"] === r ? undefined : r })}
            >
              {r}★ & up
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={!!search.inStock}
            onChange={(e) => update({ inStock: e.target.checked ? true : undefined })}
            className="h-4 w-4 accent-[oklch(0.28_0.03_50)]"
          />
          In stock only
        </label>
      </FilterGroup>

      <p className="border-t border-border pt-6 text-xs text-muted-foreground">
        Looking for something specific?{" "}
        <Link to="/contact" className="underline underline-offset-4 hover:text-espresso">
          Ask our studio
        </Link>
        .
      </p>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-3 text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 text-xs transition-colors",
        active ? "border-espresso bg-espresso text-ivory" : "border-border hover:border-espresso",
      )}
    >
      {children}
    </button>
  );
}
