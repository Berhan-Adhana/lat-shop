// prisma/seed.ts
// Run: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ──────────────────────────────────────────────────────
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
  console.log("✅ Admin user:", admin.email);

  // ── Categories ──────────────────────────────────────────────────────
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
    // ── NEW ──
    {
      name: "Books",
      slug: "books",
      description:
        "African literature, history, culture, and children's books celebrating African heritage",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description },
      create: cat,
    });
  }
  console.log("✅ Categories seeded:", categories.length);

  // ── Shipping zones ──────────────────────────────────────────────────
  const zones = [
    { name: "Canada", countries: ["CA"], rate: 12.0, freeOver: 100.0 },
    { name: "United States", countries: ["US"], rate: 18.0, freeOver: 150.0 },
    {
      name: "Europe",
      countries: ["GB", "FR", "DE", "IT", "ES", "NL", "BE", "PT", "SE", "NO"],
      rate: 30.0,
      freeOver: 200.0,
    },
  ];

  for (const zone of zones) {
    const existing = await prisma.shippingZone.findFirst({
      where: { name: zone.name },
    });
    if (!existing) await prisma.shippingZone.create({ data: zone });
  }
  console.log("✅ Shipping zones seeded");

  // ── Welcome coupon ──────────────────────────────────────────────────
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
  console.log("✅ Welcome coupon: WELCOME10");

  console.log("\n🎉 Seeding complete!");
  console.log("Admin: admin@latshop.com / admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
