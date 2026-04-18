// src/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/helpers";

// GET /api/products — public, with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get("category");
    const featured  = searchParams.get("featured");
    const search    = searchParams.get("search");
    const page      = Number(searchParams.get("page") ?? 1);
    const pageSize  = Number(searchParams.get("pageSize") ?? 12);
    const sort      = searchParams.get("sort") ?? "featured";

    const where: any = { isActive: true };
    if (category) where.category = { slug: category };
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { name:        { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author:      { contains: search, mode: "insensitive" } },
        { tags:        { has: search.toLowerCase() } },
      ];
    }

    const orderBy: any =
      sort === "price_asc"  ? { price: "asc" }     :
      sort === "price_desc" ? { price: "desc" }    :
      sort === "newest"     ? { createdAt: "desc" } :
      { featured: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pageSize });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products — admin only, saves ALL fields including book fields
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Name, price and category are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const baseSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure slug is unique
    let slug = baseSlug;
    let attempt = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt++}`;
    }

    const product = await prisma.product.create({
      data: {
        // ── Core ──────────────────────────────────────
        name:        body.name,
        slug,
        description: body.description ?? "",
        price:       Number(body.price),
        salePrice:   body.salePrice ? Number(body.salePrice) : null,
        onSale:      body.onSale ?? false,
        stock:       Number(body.stock ?? 0),
        images:      body.images ?? [],
        videoUrl:    body.videoUrl ?? null,
        featured:    body.featured ?? false,
        isActive:    body.isActive ?? true,
        categoryId:  body.categoryId,

        // ── General product details ────────────────────
        materials:   body.materials  ?? null,
        careInfo:    body.careInfo   ?? null,
        dimensions:  body.dimensions ?? null,
        weight:      body.weight     ?? null,
        origin:      body.origin     ?? null,
        isHandmade:  body.isHandmade ?? true,
        tags:        body.tags       ?? [],

        // ── Book-specific fields ───────────────────────
        author:      body.author     ?? null,
        isbn:        body.isbn       ?? null,
        publisher:   body.publisher  ?? null,
        pageCount:   body.pageCount  ? Number(body.pageCount) : null,
        language:    body.language   ?? null,
        ageRange:    body.ageRange   ?? null,
        format:      body.format     ?? null,
        edition:     body.edition    ?? null,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to create product" },
      { status: 500 }
    );
  }
}
