import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartCount, useWishlist } from "@/lib/store";
import { SearchOverlay } from "./SearchOverlay";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "Rooms", to: "/rooms" },
  { label: "Inspiration", to: "/inspiration" },
  { label: "About", to: "/about" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartCount();
  const wishlistCount = useWishlist().length;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300",
          scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent bg-background",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <button
            type="button"
            className="-ml-2 flex h-10 w-10 items-center justify-center lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu width={20} height={20} />
          </button>

          <Link to="/" className="flex flex-col leading-none" aria-label="LUMIÈRE HOME — home">
            <span className="font-display text-xl tracking-[0.3em] md:text-2xl">LUMIÈRE</span>
            <span className="eyebrow text-[0.55rem] text-muted-foreground md:text-[0.6rem]">
              Home
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[0.7rem] tracking-[0.2em] uppercase text-foreground/80 transition-colors hover:text-gold"
                    activeProps={{ className: "text-gold" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center transition-colors hover:text-gold"
              aria-label="Search"
            >
              <Search width={19} height={19} />
            </button>
            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-gold"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
            >
              <Heart width={19} height={19} />
              <Counter value={wishlistCount} />
            </Link>
            <Link
              to="/account"
              className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-gold sm:flex"
              aria-label="Account"
            >
              <User width={19} height={19} />
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-gold"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag width={19} height={19} />
              <Counter value={cartCount} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-charcoal/40 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          aria-label="Mobile"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(86vw,22rem)] flex-col bg-background transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[4.5rem] items-center justify-between border-b border-border px-5">
            <span className="font-display text-lg tracking-[0.28em]">LUMIÈRE</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Close menu"
            >
              <X width={20} height={20} />
            </button>
          </div>
          <ul className="flex flex-col px-5 py-4">
            {NAV.map((item) => (
              <li key={item.to} className="border-b border-border/60">
                <Link
                  to={item.to}
                  className="block py-4 font-display text-2xl"
                  activeProps={{ className: "text-gold" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 border-t border-border px-5 py-6 text-[0.7rem] tracking-[0.2em] uppercase">
            <Link to="/account">Account</Link>
            <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
          </div>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Counter({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span
      key={value}
      className="lum-pop absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-medium text-espresso"
    >
      {value}
    </span>
  );
}
