# LUMIÈRE HOME — Luxury Home Decor E-Commerce

A complete, fully functional decor store: 13 pages, 50+ real products, working cart, wishlist, search, filters, budget decorator, shop-the-look, multi-step checkout and order history.

## Note on the stack

This environment runs a fixed React + TanStack Router setup, so plain `index.html` / `shop.html` files can't be served. I'll build the exact same site — same pages, same URLs, same behaviour, same look — as routes on this stack. Nothing in the feature list is lost.

Page map:

```text
/                 home            /wishlist        wishlist
/shop             shop + filters  /checkout        3-step checkout
/product/$id      product detail  /order-success   confirmation
/categories       category grid   /account         profile/orders
/rooms            shop by room    /about           brand story
/inspiration      editorial       /contact         validated form
/cart             cart
```

## Design direction

Warm ivory and cream base, espresso brown text, soft beige surfaces, muted gold used only for accents and thin rules. Serif display headings (Cormorant / Playfair feel) paired with a clean sans body. Generous whitespace, square-ish edges, editorial grids, no gradients or neon. All colors defined as semantic tokens in `src/styles.css`.

Photography: curated realistic interior and product photos loaded from a free stock image service, with consistent warm-toned crops and lazy loading, plus graceful fallbacks so layouts never break.

## What gets built

**Data** — one product source of truth: 50+ unique decor items (wall art, showpieces, plants, lighting, candles, mirrors, rugs, soft decor, curtains, vases, storage, tabletop, entryway, kids, balcony, DIY, personalized, festive, Islamic, handmade) each with id, name, category, subcategory, PKR price, discount, rating, reviews, description, material, color, style, room, dimensions, stock, images and tags. No furniture. The full category/subcategory taxonomy from the brief drives the categories page and shop filters.

**Homepage** — full-bleed hero with "Elevate Your Space." and both CTAs plus scroll cue, then New Arrivals, Shop by Category, Shop by Room (8 rooms), Best Sellers, interactive Shop the Look with clickable hotspots, Budget Decorator, Luxury Collection, Handmade Collection, reviews, newsletter, footer.

**Shop** — live search, sidebar filters (category, subcategory, price, color, material, style, room, rating, availability) that become a slide-out drawer on mobile, six sort modes, result count and clear-all. 4/3/2/1-column responsive grid.

**Product detail** — gallery with thumbnails, rating, price and discount, stock, description, material/dimension/color specs, quantity stepper, Add to Cart, Buy Now, Add to Wishlist, and a related-products rail. Records recently viewed.

**Cart / Wishlist** — localStorage-backed, persist across refresh, live header counters. Quantity controls, remove, coupon field, subtotal, ₨250 delivery free above ₨10,000, total. Wishlist supports move-to-cart. Designed empty states with the exact copy requested.

**Checkout → Order success** — three validated steps (customer info, delivery address with Pakistani cities, payment: COD / bank transfer / card), then a confirmation page with demo order number, items, totals, address, payment method and estimated delivery. Cart clears; order is saved and shows in Account → Orders.

**Other pages** — Categories (grouped, clickable into filtered shop), Rooms (8 rooms with relevant decor only), Inspiration (six editorial articles with expandable reading view), About (brand story, mission, philosophy, quality, handmade, customer-first), Contact (validated five-field form with success message plus support details), Account (profile, orders, wishlist, addresses, recently viewed, logout).

**Global** — sticky nav with logo, six links, search/wishlist/account/cart icons with live counts, working hamburger menu on mobile, full-screen search overlay with instant results, toast notifications on add-to-cart/wishlist, and a premium multi-column footer with all listed links and social icons.

## Technical notes

- State via small localStorage-backed stores (`cart`, `wishlist`, `orders`, `recentlyViewed`, `profile`) with subscription so counters update everywhere instantly.
- One shared product module; every surface references products by id, so names, prices and images are always consistent.
- Design tokens only — no hardcoded color utilities. Per-route `head()` metadata with unique titles and descriptions.
- Accessibility: semantic landmarks, real buttons, alt text, labelled inputs, visible focus rings, keyboard-operable menus, overlays and drawers.
- Subtle, fast micro-interactions: image zoom on hover, heart pop, counter bump, fade-in sections, smooth drawer transitions.
- Responsive from small mobile to 4K with no horizontal overflow.
