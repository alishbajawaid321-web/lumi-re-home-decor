import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, Send } from "lucide-react";
import { notify } from "@/lib/store";
import { inputBase } from "@/lib/ui";

const shopLinks = [
  { label: "All Products", to: "/shop" as const, search: {} },
  { label: "New Arrivals", to: "/shop" as const, search: { sort: "newest" } },
  { label: "Best Sellers", to: "/shop" as const, search: { collection: "best" } },
  { label: "Luxury Collection", to: "/shop" as const, search: { collection: "luxury" } },
  { label: "Handmade Collection", to: "/shop" as const, search: { collection: "handmade" } },
  { label: "Sale", to: "/shop" as const, search: { collection: "sale" } },
];

const categoryLinks = [
  { label: "Wall Decor", slug: "wall-decor" },
  { label: "Showpieces", slug: "showpieces" },
  { label: "Lighting", slug: "lighting" },
  { label: "Plants", slug: "plants" },
  { label: "Candles", slug: "candles" },
  { label: "Mirrors", slug: "mirrors" },
  { label: "Rugs", slug: "rugs" },
  { label: "Personalized Decor", slug: "personalized" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      notify("Please enter a valid email address");
      return;
    }
    notify("Thank you — inspiration is on its way.", "success");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl tracking-[0.3em]">LUMIÈRE</p>
          <p className="eyebrow mt-1 text-muted-foreground">Home</p>
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            Thoughtfully curated decor for homes that tell a story. Shipping across Pakistan.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink label="Instagram">
              <Instagram width={16} height={16} />
            </SocialLink>
            <SocialLink label="Facebook">
              <Facebook width={16} height={16} />
            </SocialLink>
            <SocialLink label="Pinterest">
              <Send width={16} height={16} />
            </SocialLink>
            <SocialLink label="TikTok">
              <Music2 width={16} height={16} />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Shop">
          {shopLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} search={l.search} className="hover:text-gold">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Categories">
          {categoryLinks.map((l) => (
            <li key={l.slug}>
              <Link to="/shop" search={{ category: l.slug }} className="hover:text-gold">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Help">
          <li>
            <Link to="/contact" className="hover:text-gold">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/contact" hash="faq" className="hover:text-gold">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contact" hash="shipping" className="hover:text-gold">
              Shipping
            </Link>
          </li>
          <li>
            <Link to="/contact" hash="returns" className="hover:text-gold">
              Returns
            </Link>
          </li>
          <li>
            <Link to="/contact" hash="privacy" className="hover:text-gold">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/contact" hash="terms" className="hover:text-gold">
              Terms
            </Link>
          </li>
        </FooterColumn>

        <FooterColumn title="About">
          <li>
            <Link to="/about" className="hover:text-gold">
              Our Story
            </Link>
          </li>
          <li>
            <Link to="/inspiration" className="hover:text-gold">
              Inspiration
            </Link>
          </li>
          <li>
            <Link to="/about" hash="sustainability" className="hover:text-gold">
              Sustainability
            </Link>
          </li>
          <li>
            <Link to="/account" className="hover:text-gold">
              My Account
            </Link>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl">A little inspiration, delivered.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Styling notes and new arrivals, once a month.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputBase}
            />
            <button
              type="submit"
              className="border border-espresso bg-espresso px-6 text-[0.68rem] tracking-[0.2em] text-ivory transition-colors hover:bg-transparent hover:text-espresso"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Lumière Home. A demo storefront.</p>
          <p>Cash on Delivery · Free delivery over ₨10,000 · Karachi · Lahore · Islamabad</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow text-muted-foreground">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="https://www.instagram.com"
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-espresso hover:text-gold"
    >
      {children}
    </a>
  );
}
