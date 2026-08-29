import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { img } from "@/lib/images";
import {
  AVAILABLE_CATEGORIES,
  categoryName,
  finalPrice,
  formatPKR,
  searchProducts,
} from "@/lib/products";
import { inputBase } from "@/lib/ui";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(query, 8), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-background/98 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="shell flex h-full max-h-screen flex-col py-6 md:py-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-muted-foreground">Search</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-border hover:border-espresso"
            aria-label="Close search"
          >
            <X width={18} height={18} />
          </button>
        </div>

        <div className="relative mt-8">
          <Search
            width={18}
            height={18}
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="global-search" className="sr-only">
            Search for decor
          </label>
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “candle”, “brass”, “wall art”…"
            className="w-full border-0 border-b border-border bg-transparent py-4 pl-8 font-display text-2xl focus:border-gold focus:outline-none md:text-4xl"
            autoComplete="off"
          />
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <div>
              <p className="eyebrow mb-4 text-muted-foreground">Popular categories</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.slice(0, 10).map((c) => (
                  <Link
                    key={c.slug}
                    to="/shop"
                    search={{ category: c.slug }}
                    onClick={onClose}
                    className="border border-border px-4 py-2 text-xs tracking-[0.14em] uppercase hover:border-espresso"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="max-w-lg">
              <h2 className="font-display text-3xl">We couldn't find anything matching your search.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Try a different word, or start from one of these collections.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {AVAILABLE_CATEGORIES.slice(0, 8).map((c) => (
                  <Link
                    key={c.slug}
                    to="/shop"
                    search={{ category: c.slug }}
                    onClick={onClose}
                    className="border border-border px-4 py-2 text-xs uppercase tracking-[0.14em] hover:border-espresso"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-4 text-muted-foreground">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={onClose}
                      className="flex items-center gap-4 py-4 transition-colors hover:bg-cream"
                    >
                      <img
                        src={img(p.imageKey)}
                        alt={p.name}
                        loading="lazy"
                        width={80}
                        height={80}
                        className="h-16 w-16 flex-none object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-lg">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {categoryName(p.category)} · {p.subcategory}
                        </span>
                      </span>
                      <span className="flex-none text-sm">{formatPKR(finalPrice(p))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/shop"
                  search={{ q: query }}
                  onClick={onClose}
                  className={inputBase.replace("w-full", "inline-block w-auto") + " hover:border-espresso"}
                >
                  See all results in Shop
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
