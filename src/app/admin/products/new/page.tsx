// src/app/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import s from "../../admin.module.css";

interface Category { id: string; name: string; }

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", price: "", salePrice: "",
    onSale: false, stock: "", categoryId: "",
    featured: false, isActive: true,
    // New detail fields
    materials: "", careInfo: "", dimensions: "",
    weight: "", origin: "", isHandmade: true, tags: "",
  });

  // Load product + categories
  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([product, cats]) => {
      setCategories(cats);
      setForm({
        name: product.name ?? "",
        description: product.description ?? "",
        price: String(product.price ?? ""),
        salePrice: String(product.salePrice ?? ""),
        onSale: product.onSale ?? false,
        stock: String(product.stock ?? ""),
        categoryId: product.categoryId ?? "",
        featured: product.featured ?? false,
        isActive: product.isActive ?? true,
        materials: product.materials ?? "",
        careInfo: product.careInfo ?? "",
        dimensions: product.dimensions ?? "",
        weight: product.weight ?? "",
        origin: product.origin ?? "",
        isHandmade: product.isHandmade !== false,
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
      setImages(product.images ?? []);
      setVideoUrl(product.videoUrl ?? "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // ── Upload images ──────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error ?? "Upload failed"); continue; }
        if (data.type === "image") setImages((prev) => [...prev, data.url]);
      }
      toast.success("Images uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploadingImages(false); }
  };

  // ── Upload video — URL comes from Cloudinary automatically ─────────
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Video upload failed"); return; }
      setVideoUrl(data.url); // ← URL set automatically from Cloudinary
      toast.success(`Video uploaded! (${data.duration ? Math.round(data.duration) + "s" : ""})`);
    } catch { toast.error("Video upload failed"); }
    finally { setUploadingVideo(false); }
  };

  // ── Save product ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.categoryId) { toast.error("Please select a category"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          onSale: form.onSale,
          stock: Number(form.stock),
          categoryId: form.categoryId,
          featured: form.featured,
          isActive: form.isActive,
          images,
          videoUrl: videoUrl || null,
          materials: form.materials || null,
          careInfo: form.careInfo || null,
          dimensions: form.dimensions || null,
          weight: form.weight || null,
          origin: form.origin || null,
          isHandmade: form.isHandmade,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error ?? "Failed to save"); return; }
      toast.success("Product saved!");
      router.push("/admin/products");
    } catch { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  if (loading) return <div style={{ padding: 40, color: "#7a3f1d" }}>Loading product...</div>;

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Edit Product</h1>
          <p className={s.pageSubtitle}>{form.name}</p>
        </div>
        <Link href="/admin/products" className={s.btnSecondary}>← Back to Products</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Basic info */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Basic Information</h3>
            <div className={s.fieldGrid}>
              <div className={`${s.field} ${s.fieldFull}`}>
                <label>Product Name</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className={`${s.field} ${s.fieldFull}`}>
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} />
              </div>
              <div className={s.field}>
                <label>Price (CA$)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div className={s.field}>
                <label>Stock</label>
                <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
              </div>
              <div className={s.field}>
                <label>Sale Price (CA$)</label>
                <input type="number" step="0.01" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="Leave empty if no sale" />
              </div>
              <div className={s.field}>
                <label>Category</label>
                <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Product Details</h3>
            <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 16, fontFamily: "system-ui" }}>
              Shown in the Materials &amp; Care tab on the product page.
            </p>
            <div className={s.fieldGrid}>
              <div className={`${s.field} ${s.fieldFull}`}>
                <label>Materials</label>
                <input value={form.materials} onChange={(e) => set("materials", e.target.value)}
                  placeholder="e.g. Sterling silver, hand-dyed glass beads, cotton cord" />
              </div>
              <div className={`${s.field} ${s.fieldFull}`}>
                <label>Care Instructions</label>
                <input value={form.careInfo} onChange={(e) => set("careInfo", e.target.value)}
                  placeholder="e.g. Wipe clean with soft cloth. Avoid water and perfume." />
              </div>
              <div className={s.field}>
                <label>Dimensions</label>
                <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)}
                  placeholder="e.g. Length: 45cm | Pendant: 3cm" />
              </div>
              <div className={s.field}>
                <label>Weight</label>
                <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 28g" />
              </div>
              <div className={s.field}>
                <label>Country of Origin</label>
                <input value={form.origin} onChange={(e) => set("origin", e.target.value)}
                  placeholder="e.g. Ghana, Nigeria, Kenya" />
              </div>
              <div className={s.field}>
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
                  placeholder="e.g. necklace, beaded, gift, women" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Product Images</h3>
            <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 14, fontFamily: "system-ui" }}>
              First image is the main display photo. Drag to reorder coming soon.
            </p>
            {images.length > 0 && (
              <div className={s.imageGrid} style={{ marginBottom: 14 }}>
                {images.map((url, i) => (
                  <div key={i} className={s.imageThumb}>
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                    {i === 0 && (
                      <span style={{ position: "absolute", bottom: 3, left: 3, background: "#d4832a", color: "#fff", fontSize: 9, padding: "1px 5px", borderRadius: 3, fontFamily: "system-ui" }}>
                        MAIN
                      </span>
                    )}
                    <button type="button" className={s.imageThumbRemove}
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}>×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className={s.uploadZone}>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
              <div style={{ fontSize: 28 }}>{uploadingImages ? "⏳" : "📷"}</div>
              <p className={s.uploadZoneText}>
                {uploadingImages ? "Uploading images..." : "Click to upload images"}
              </p>
              <p style={{ fontSize: 12, color: "#b86820", marginTop: 4 }}>
                JPG, PNG, WebP · Max 10MB each
              </p>
            </label>
          </div>

          {/* Video upload */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Product Video</h3>
            <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 14, fontFamily: "system-ui" }}>
              Upload a video directly — the URL is set automatically. Even a 15-second phone video boosts sales.
            </p>

            {/* Current video preview */}
            {videoUrl && (
              <div style={{ marginBottom: 14, background: "#faefd9", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                <video
                  src={videoUrl}
                  controls
                  style={{ width: "100%", maxHeight: 200, display: "block", background: "#000" }}
                />
                <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 12, color: "#7a3f1d", fontFamily: "system-ui", wordBreak: "break-all" }}>
                    ✅ Video uploaded to Cloudinary
                  </p>
                  <button
                    type="button"
                    onClick={() => setVideoUrl("")}
                    style={{ fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "system-ui", flexShrink: 0 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <label className={s.uploadZone}>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/avi"
                onChange={handleVideoUpload}
                style={{ display: "none" }}
                disabled={uploadingVideo}
              />
              {uploadingVideo ? (
                <>
                  <div style={{ fontSize: 28 }}>⏳</div>
                  <p className={s.uploadZoneText}>Uploading video to Cloudinary...</p>
                  <p style={{ fontSize: 12, color: "#b86820", marginTop: 4 }}>This may take a moment for larger files</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28 }}>🎬</div>
                  <p className={s.uploadZoneText}>
                    {videoUrl ? "Click to replace video" : "Click to upload video"}
                  </p>
                  <p style={{ fontSize: 12, color: "#b86820", marginTop: 4 }}>
                    MP4, MOV, WebM · Max 100MB · URL set automatically
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Visibility toggles */}
          <div className={s.formCard}>
            <h3 className={s.formCardTitle}>Visibility</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "isActive",   label: "Active",      sub: "Show in shop" },
                { key: "onSale",     label: "On Sale",     sub: "Show sale badge" },
                { key: "featured",   label: "Featured",    sub: "Show on homepage" },
                { key: "isHandmade", label: "Handcrafted", sub: "Show handmade badge" },
              ].map((opt) => (
                <div key={opt.key} className={s.toggleRow}>
                  <button
                    type="button"
                    className={`${s.toggle} ${form[opt.key as keyof typeof form] ? s.toggleOn : ""}`}
                    onClick={() => set(opt.key, !form[opt.key as keyof typeof form])}
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
            style={{ width: "100%", justifyContent: "center", padding: 13 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link href="/admin/products" className={s.btnSecondary}
            style={{ width: "100%", justifyContent: "center" }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
