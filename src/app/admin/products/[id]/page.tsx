// src/app/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductFormFields, { type Category, type ProductForm } from "@/components/admin/ProductFormFields";
import s from "../../admin.module.css";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "", description: "", price: "", salePrice: "",
    onSale: false, stock: "", categoryId: "",
    featured: false, isActive: true, isHandmade: true,
    materials: "", careInfo: "", dimensions: "", weight: "", origin: "", tags: "",
    author: "", isbn: "", publisher: "", pageCount: "",
    language: "", ageRange: "", format: "", edition: "",
  });

  // Load product + categories in parallel
  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([product, cats]) => {
        if (Array.isArray(cats)) setCategories(cats);
        setForm({
          name:        product.name        ?? "",
          description: product.description ?? "",
          price:       String(product.price ?? ""),
          salePrice:   product.salePrice ? String(product.salePrice) : "",
          onSale:      product.onSale      ?? false,
          stock:       String(product.stock ?? ""),
          categoryId:  product.categoryId  ?? "",
          featured:    product.featured    ?? false,
          isActive:    product.isActive    ?? true,
          isHandmade:  product.isHandmade  !== false,
          // General details
          materials:   product.materials   ?? "",
          careInfo:    product.careInfo    ?? "",
          dimensions:  product.dimensions  ?? "",
          weight:      product.weight      ?? "",
          origin:      product.origin      ?? "",
          tags:        Array.isArray(product.tags) ? product.tags.join(", ") : "",
          // Book fields
          author:      product.author      ?? "",
          isbn:        product.isbn        ?? "",
          publisher:   product.publisher   ?? "",
          pageCount:   product.pageCount   ? String(product.pageCount) : "",
          language:    product.language    ?? "",
          ageRange:    product.ageRange    ?? "",
          format:      product.format      ?? "",
          edition:     product.edition     ?? "",
        });
        setImages(product.images ?? []);
        setVideoUrl(product.videoUrl ?? "");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (key: keyof ProductForm, val: any) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error ?? "Upload failed"); continue; }
        if (data.type === "image") setImages((prev) => [...prev, data.url]);
      }
      toast.success("Image(s) uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploadingImages(false); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Video upload failed"); return; }
      setVideoUrl(data.url);
      toast.success("Video uploaded!");
    } catch { toast.error("Video upload failed"); }
    finally { setUploadingVideo(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.categoryId)  { toast.error("Please select a category"); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          description: form.description,
          price:       Number(form.price),
          salePrice:   form.salePrice ? Number(form.salePrice) : null,
          onSale:      form.onSale,
          stock:       Number(form.stock),
          categoryId:  form.categoryId,
          featured:    form.featured,
          isActive:    form.isActive,
          isHandmade:  form.isHandmade,
          images,
          videoUrl:    videoUrl || null,
          // General details
          materials:   form.materials  || null,
          careInfo:    form.careInfo   || null,
          dimensions:  form.dimensions || null,
          weight:      form.weight     || null,
          origin:      form.origin     || null,
          tags:        form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          // Book details
          author:      form.author    || null,
          isbn:        form.isbn      || null,
          publisher:   form.publisher || null,
          pageCount:   form.pageCount ? Number(form.pageCount) : null,
          language:    form.language  || null,
          ageRange:    form.ageRange  || null,
          format:      form.format    || null,
          edition:     form.edition   || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Failed to save");
        return;
      }

      toast.success("Saved!");
      router.push("/admin/products");
    } catch { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  };

  const isBook = categories.find((c) => c.id === form.categoryId)?.slug === "books";

  if (loading) return (
    <div style={{ padding: 40, color: "#7a3f1d", fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 20, height: 20, border: "2px solid #f4dbb0", borderTopColor: "#d4832a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      Loading product...
    </div>
  );

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>{isBook ? "Edit Book" : "Edit Product"}</h1>
          <p className={s.pageSubtitle}>{form.name}</p>
        </div>
        <Link href="/admin/products" className={s.btnSecondary}>← Back to Products</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: form fields ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ProductFormFields
            form={form}
            onChange={handleChange}
            categories={categories}
            images={images}
            onRemoveImage={(i) => setImages(images.filter((_, idx) => idx !== i))}
            videoUrl={videoUrl}
            onRemoveVideo={() => setVideoUrl("")}
            uploadingImages={uploadingImages}
            uploadingVideo={uploadingVideo}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
            s={s}
          />
        </div>

        {/* ── RIGHT: toggles + save ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Visibility</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "isActive",   label: "Active",      sub: "Show in shop" },
                { key: "onSale",     label: "On Sale",     sub: "Show sale badge & use sale price" },
                { key: "featured",   label: "Featured",    sub: "Show on homepage" },
                ...(!isBook ? [{ key: "isHandmade", label: "Handcrafted", sub: "Show handmade badge" }] : []),
              ].map((opt) => (
                <div key={opt.key} className={s.toggleRow}>
                  <button
                    type="button"
                    className={`${s.toggle} ${form[opt.key as keyof ProductForm] ? s.toggleOn : ""}`}
                    onClick={() => handleChange(opt.key as keyof ProductForm, !form[opt.key as keyof ProductForm])}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1209" }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#7a3f1d" }}>{opt.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={s.btnPrimary}
            onClick={handleSave}
            disabled={saving}
            style={{ width: "100%", justifyContent: "center", padding: "13px" }}
          >
            {saving ? "Saving..." : isBook ? "Save Book" : "Save Changes"}
          </button>

          <Link
            href="/admin/products"
            className={s.btnSecondary}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
