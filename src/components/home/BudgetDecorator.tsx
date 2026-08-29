import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { img } from "@/lib/images";
import {
  AVAILABLE_ROOMS,
  buildBudgetCollection,
  finalPrice,
  formatPKR,
} from "@/lib/products";
import { addToCart, notify } from "@/lib/store";
import { btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

const BUDGETS = [10000, 25000, 50000, 100000, 250000];
const BUDGET_ROOMS = AVAILABLE_ROOMS.filter((r) =>
  ["living", "bedroom", "dining", "bathroom", "balcony", "entrance"].includes(r.slug),
);

export function BudgetDecorator() {
  const [budget, setBudget] = useState(25000);
  const [room, setRoom] = useState("living");

  const picks = useMemo(() => buildBudgetCollection(budget, room), [budget, room]);
  const total = picks.reduce((n, p) => n + finalPrice(p), 0);
  const remaining = budget - total;

  const addAll = () => {
    picks.forEach((p) => addToCart(p.id, 1, true));
    notify(`${picks.length} pieces added to cart`, "success");
  };

  return (
    <section className="border-y border-border bg-cream py-20 md:py-28">
      <div className="shell">
        <p className="eyebrow text-gold">Budget decorator</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
          Decorate within your budget.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Choose a room and a number. We'll assemble a complete arrangement that never goes over it.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[20rem_1fr]">
          <div className="space-y-8">
            <fieldset>
              <legend className="eyebrow mb-3 text-muted-foreground">Your budget</legend>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    aria-pressed={budget === b}
                    className={cn(
                      "border px-4 py-2.5 text-xs tracking-[0.14em] transition-colors",
                      budget === b
                        ? "border-espresso bg-espresso text-ivory"
                        : "border-border hover:border-espresso",
                    )}
                  >
                    {formatPKR(b)}
                    {b === 250000 ? "+" : ""}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow mb-3 text-muted-foreground">Your room</legend>
              <div className="flex flex-wrap gap-2">
                {BUDGET_ROOMS.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => setRoom(r.slug)}
                    aria-pressed={room === r.slug}
                    className={cn(
                      "border px-4 py-2.5 text-xs tracking-[0.14em] transition-colors",
                      room === r.slug
                        ? "border-espresso bg-espresso text-ivory"
                        : "border-border hover:border-espresso",
                    )}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="border border-border bg-background p-6">
              <p className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Collection total</span>
                <span className="font-display text-2xl">{formatPKR(total)}</span>
              </p>
              <p className="mt-2 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Left in budget</span>
                <span>{formatPKR(Math.max(remaining, 0))}</span>
              </p>
              <button
                type="button"
                onClick={addAll}
                disabled={picks.length === 0}
                className={cn(btnPrimary, "mt-5 w-full")}
              >
                ADD COLLECTION TO CART
              </button>
            </div>
          </div>

          <div>
            {picks.length === 0 ? (
              <p className="border border-border bg-background p-8 text-sm text-muted-foreground">
                Nothing fits this budget for that room yet — try a higher amount.
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {picks.map((p) => (
                  <li key={p.id} className="flex gap-4 border border-border bg-background p-3">
                    <img
                      src={img(p.imageKey)}
                      alt={p.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="h-20 w-20 flex-none object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="line-clamp-2 font-display text-base hover:text-gold"
                      >
                        {p.name}
                      </Link>
                      <span className="mt-auto text-xs text-muted-foreground">Qty 1</span>
                      <span className="text-sm">{formatPKR(finalPrice(p))}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(p.id)}
                        className="mt-2 self-start border-b border-espresso text-[0.62rem] tracking-[0.18em] hover:border-gold hover:text-gold"
                      >
                        ADD
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
