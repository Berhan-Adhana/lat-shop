// prisma/seed.ts
// Run with: npm run db:seed
// Seeds the database with initial categories, shipping zones, and an admin user

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin User ──────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@latshop.com" },
    update: {},
    create: {
      name: "Lat Admin",
      email: "admin@latshop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ── Categories ──────────────────────────────
  const categories = [
    {
      name: "African Gifts",
      slug: "african-gifts",
      description: "Authentic African-inspired gifts and keepsakes",
    },
    {
      name: "Jewelry",
      slug: "jewelry",
      description: "Handcrafted necklaces, bracelets, earrings and rings",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Bags, scarves, and fashion accessories",
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      description: "African-inspired art and home decoration pieces",
    },
    {
      name: "Gift Sets",
      slug: "gift-sets",
      description: "Curated gift sets for special occasions",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created:", categories.length);

  // ── Shipping Zones ──────────────────────────
  const shippingZones = [
    {
      name: "Canada",
      countries: ["CA"],
      rate: 12.0,
      freeOver: 100.0,
    },
    {
      name: "United States",
      countries: ["US"],
      rate: 18.0,
      freeOver: 150.0,
    },
    {
      name: "Europe",
      countries: ["GB", "FR", "DE", "IT", "ES", "NL", "BE", "PT", "SE", "NO"],
      rate: 30.0,
      freeOver: 200.0,
    },
  ];

  for (const zone of shippingZones) {
    await prisma.shippingZone.create({ data: zone }).catch(() => {
      // already exists, skip
    });
  }
  console.log("✅ Shipping zones created:", shippingZones.length);

  // ── Welcome Coupon ───────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 30,
      onePerCustomer: true,
      isActive: true,
    },
  });
  console.log("✅ Welcome coupon created: WELCOME10");

  console.log("\n🎉 Seeding complete!");
  console.log("────────────────────────────");
  console.log("Admin login:");
  console.log("  Email:    admin@latshop.com");
  console.log("  Password: admin123!");
  console.log("────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
