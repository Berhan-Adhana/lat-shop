# Phase 3 — Shop Frontend

## What's Included

### Pages
| Route | Component | Description |
|---|---|---|
| `/` | `(shop)/page.tsx` | Homepage — hero, categories, featured products, why us, CTA |
| `/shop` | `(shop)/shop/page.tsx` | Product grid with filters, sort, pagination |
| `/product/[slug]` | `(shop)/product/[slug]/page.tsx` | Product detail with images, reviews, add to cart |

### Components

**Layout**
- `Navbar.tsx` — sticky nav with cart badge, user menu, mobile hamburger
- `Footer.tsx` — links, social, payment icons
- `(shop)/layout.tsx` — wraps shop pages with Navbar + Footer + CartDrawer

**Shop**
- `ProductCard.tsx` — product grid card with quick-add on hover
- `ShopFilters.tsx` — sidebar category + price filters
- `AddToCartButton.tsx` — qty selector + add to cart on product page

**Cart**
- `CartDrawer.tsx` — slide-in cart drawer with quantity controls

### API Routes
- `GET /api/products` — paginated product list with filters
- `POST /api/products` — create product (admin only)
- `GET /api/categories` — all active categories
- `POST /api/categories` — create category (admin only)

---

## Design Decisions

- **Warm African palette** — amber/gold tones throughout, dark hero
- **Playfair Display** for headings (elegant, editorial)
- **System UI** for body text (readable, fast)
- **Server components** for all data fetching — fast page loads + great SEO
- **Client components** only where interactivity is needed (cart, filters)

---

## Merging with Previous Phases

Copy all files into your Phase 1 project. The folder structure matches exactly.

---

## What's Next — Phase 4

- Checkout page (address form, order summary)
- Stripe payment integration
- PayPal payment integration
- Webhook handlers (payment confirmation)
- Order confirmation page
- Email on successful payment
