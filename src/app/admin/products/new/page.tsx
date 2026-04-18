// src/app/admin/products/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductFormFields, { emptyForm, type Category, type ProductForm } from "@/components/admin/ProductFormFields";
import s from "../../admin.module.css";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            setForm((f) => ({ ...f, categoryId: data[0].id }));
          }
        }
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.price)        { toast.error("Price is required"); return; }
    if (!form.stock)        { toast.error("Stock quantity is required"); return; }
    if (!form.categoryId)   { toast.error("Please select a category"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
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

      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to create product"); return; }

      toast.success(form.categoryId && categories.find(c => c.id === form.categoryId)?.slug === "books"
        ? "Book created!" : "Product created!");
      router.push("/admin/products");
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setSaving(false); }
  };

  const isBook = categories.find((c) => c.id === form.categoryId)?.slug === "books";

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>{isBook ? "Add Book" : "Add Product"}</h1>
          <p className={s.pageSubtitle}>
            {isBook
              ? "Select Books category first to see all book-specific fields"
              : "Fill in the details below"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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

            {/* Visibility toggles */}
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

            {/* Tips */}
            <div style={{ background: "#faefd9", border: "1px solid #ecc07f", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1209", marginBottom: 8, fontFamily: "system-ui" }}>
                {isBook ? "📚 Book listing tips" : "💡 Tips for great listings"}
              </p>
              <ul style={{ fontSize: 12, color: "#7a3f1d", fontFamily: "system-ui", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                {isBook ? (
                  <>
                    <li>Upload a clear, high-res front cover</li>
                    <li>Write a compelling synopsis in the description</li>
                    <li>Mention awards or cultural significance</li>
                    <li>Always set the age range for children's books</li>
                    <li>A short reading preview video helps sales</li>
                  </>
                ) : (
                  <>
                    <li>Upload 4–6 photos: front, back, detail, in-use</li>
                    <li>Mention the country of origin — it matters</li>
                    <li>List all materials clearly</li>
                    <li>A short product video boosts conversion</li>
                    <li>Include dimensions so customers know the size</li>
                  </>
                )}
              </ul>
            </div>

            <button
              type="submit"
              className={s.btnPrimary}
              disabled={saving || categories.length === 0}
              style={{ width: "100%", justifyContent: "center", padding: "13px" }}
            >
              {saving ? "Saving..." : isBook ? "Save Book" : "Save Product"}
            </button>

            <button
              type="button"
              className={s.btnSecondary}
              onClick={() => router.push("/admin/products")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
