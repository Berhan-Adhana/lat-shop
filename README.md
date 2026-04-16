# 🛍️ Lat Shop

An African gifts, jewelry & accessories e-commerce shop built with Next.js, PostgreSQL, Stripe & PayPal.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | Next.js 14 (App Router)           |
| Styling      | Tailwind CSS                      |
| State        | Zustand                           |
| Auth         | NextAuth.js                       |
| Database     | PostgreSQL + Prisma ORM           |
| Images       | Cloudinary                        |
| Payments     | Stripe + PayPal                   |
| Email        | Nodemailer (Gmail)                |
| Hosting      | Vercel + Railway (DB)             |

---

## Project Structure

```
lat-shop/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Initial data (admin, categories, shipping)
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, Register, Forgot Password
│   │   ├── (shop)/            # Shop, Product, Cart, Checkout
│   │   ├── (account)/         # Customer account & orders
│   │   ├── admin/             # Full admin panel
│   │   │   ├── page.tsx       # Dashboard with stats
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   ├── customers/     # Customer list
│   │   │   ├── categories/    # Category management
│   │   │   ├── discounts/     # Coupons & discounts
│   │   │   ├── shipping/      # Shipping zones & rates
│   │   │   └── settings/      # Store settings
│   │   └── api/               # Backend API routes
│   │       ├── auth/          # NextAuth endpoints
│   │       ├── products/      # Product CRUD
│   │       ├── orders/        # Order management
│   │       ├── cart/          # Cart operations
│   │       ├── coupons/       # Coupon validation & management
│   │       ├── payments/
│   │       │   ├── stripe/    # Stripe checkout
│   │       │   └── paypal/    # PayPal checkout
│   │       ├── shipping/      # Shipping rate calculator
│   │       ├── categories/    # Category CRUD
│   │       ├── users/         # User management
│   │       └── webhooks/      # Stripe & PayPal webhooks
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI (Button, Input, Modal...)
│   │   ├── shop/              # ProductCard, ProductGrid, Filters...
│   │   ├── cart/              # CartDrawer, CartItem...
│   │   ├── checkout/          # CheckoutForm, PaymentButtons...
│   │   ├── admin/             # AdminSidebar, DataTable, StatsCard...
│   │   ├── layout/            # Navbar, Footer, AdminLayout...
│   │   └── shared/            # ImageUpload, RatingStars...
│   │
│   ├── lib/
│   │   ├── db/prisma.ts       # Prisma client singleton
│   │   ├── stripe/            # Stripe helpers
│   │   ├── paypal/            # PayPal helpers
│   │   ├── email/             # Email templates & sender
│   │   └── utils/             # Formatting, validation helpers
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── store/
│   │   └── cart.store.ts      # Zustand cart state
│   ├── types/
│   │   └── index.ts           # All TypeScript types
│   └── middleware.ts          # Route protection (admin, auth)
│
├── .env.example               # All required env variables
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/lat-shop.git
cd lat-shop
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set Up Database

You can use [Railway](https://railway.app) or [Neon](https://neon.tech) for a free PostgreSQL database.

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (admin user, categories, shipping zones)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Panel

Go to [http://localhost:3000/admin](http://localhost:3000/admin)

```
Email:    admin@latshop.com
Password: admin123!
```

> ⚠️ Change this password immediately after first login!

---

## Setting Up Payments

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhook: Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`

### PayPal
1. Create Business account at [developer.paypal.com](https://developer.paypal.com)
2. Create an App to get Client ID & Secret
3. Set up webhook for `PAYMENT.CAPTURE.COMPLETED`

---

## Setting Up Cloudinary (Product Images)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, API Secret from dashboard
3. Add to `.env.local`

---

## Deployment

### Vercel (Frontend + API)
```bash
npm install -g vercel
vercel
```

### Railway (Database)
1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Copy the DATABASE_URL to your Vercel environment variables

---

## Build Phases

- [x] Phase 1: Project setup + database schema ✅
- [ ] Phase 2: Authentication (login, register)
- [ ] Phase 3: Shop frontend (homepage, products, categories)
- [ ] Phase 4: Cart + Checkout + Stripe & PayPal
- [ ] Phase 5: Admin panel (products, orders, categories)
- [ ] Phase 6: Admin discounts & coupons
- [ ] Phase 7: Customer account (orders, wishlist)
- [ ] Phase 8: Email notifications
- [ ] Phase 9: SEO & polish

---

## License

Private project — all rights reserved.
