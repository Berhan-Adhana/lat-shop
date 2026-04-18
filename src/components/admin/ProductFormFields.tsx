// src/components/admin/ProductFormFields.tsx
"use client";

import Image from "next/image";

export interface Category { id: string; name: string; slug: string; }

export interface ProductForm {
  name: string; description: string; price: string; salePrice: string;
  onSale: boolean; stock: string; categoryId: string;
  featured: boolean; isActive: boolean; isHandmade: boolean;
  // General details
  materials: string; careInfo: string; dimensions: string;
  weight: string; origin: string; tags: string;
  // Book-specific
  author: string; isbn: string; publisher: string; pageCount: string;
  language: string; ageRange: string; format: string; edition: string;
}

export const emptyForm: ProductForm = {
  name: "", description: "", price: "", salePrice: "",
  onSale: false, stock: "", categoryId: "",
  featured: false, isActive: true, isHandmade: true,
  materials: "", careInfo: "", dimensions: "", weight: "", origin: "", tags: "",
  author: "", isbn: "", publisher: "", pageCount: "",
  language: "", ageRange: "", format: "", edition: "",
};

interface Props {
  form: ProductForm;
  onChange: (key: keyof ProductForm, val: any) => void;
  categories: Category[];
  images: string[];
  onRemoveImage: (index: number) => void;
  videoUrl: string;
  onRemoveVideo: () => void;
  uploadingImages: boolean;
  uploadingVideo: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  s: any; // admin.module.css styles object
}

const BOOK_FORMATS = ["Hardcover", "Paperback", "Board Book", "E-Book", "Audiobook"];
const LANGUAGES    = ["English","Bilin","Tigrigna","Tigre","French", "Swahili", "Hausa", "Yoruba", "Igbo", "Amharic", "Zulu", "Arabic", "Portuguese", "Other"];

export default function ProductFormFields({
  form, onChange, categories, images, onRemoveImage,
  videoUrl, onRemoveVideo,
  uploadingImages, uploadingVideo, onImageUpload, onVideoUpload, s,
}: Props) {
  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const isBook = selectedCat?.slug === "books";

  return (
    <>
      {/* ── BASIC INFO ─────────────────────────────────────────── */}
      <div className={s.formCard}>
        <h3 className={s.formCardTitle}>
          {isBook ? "📚 Book Information" : "Basic Information"}
        </h3>
        <div className={s.fieldGrid}>

          {/* Category first — so switching it immediately updates the rest of the form */}
          <div className={`${s.field} ${s.fieldFull}`}>
            <label>Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => onChange("categoryId", e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {isBook && (
              <span style={{ fontSize: 12, color: "#d4832a", marginTop: 4, fontFamily: "system-ui" }}>
                📚 Book mode — extra fields shown below
              </span>
            )}
          </div>

          <div className={`${s.field} ${s.fieldFull}`}>
            <label>{isBook ? "Book Title *" : "Product Name *"}</label>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder={isBook ? "e.g. Things Fall Apart" : "e.g. African Beaded Necklace"}
              required
            />
          </div>

          <div className={`${s.field} ${s.fieldFull}`}>
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={5}
              placeholder={
                isBook
                  ? "Write a compelling synopsis. What is the book about? Why should someone read it?"
                  : "Tell the story — what makes this product special, where it comes from..."
              }
              required
            />
          </div>

          <div className={s.field}>
            <label>Price (CA$) *</label>
            <input
              type="number" step="0.01" min="0"
              value={form.price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="24.99" required
            />
          </div>

          <div className={s.field}>
            <label>Stock Quantity *</label>
            <input
              type="number" min="0"
              value={form.stock}
              onChange={(e) => onChange("stock", e.target.value)}
              placeholder="10" required
            />
          </div>

          <div className={s.field}>
            <label>Sale Price (CA$) <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
            <input
              type="number" step="0.01" min="0"
              value={form.salePrice}
              onChange={(e) => onChange("salePrice", e.target.value)}
              placeholder="Leave blank if not on sale"
            />
          </div>
        </div>
      </div>

      {/* ── BOOK-SPECIFIC FIELDS ─────────────────────────────────── */}
      {isBook && (
        <div className={s.formCard} style={{ borderColor: "#d4832a" }}>
          <h3 className={s.formCardTitle} style={{ color: "#d4832a" }}>📖 Book Details</h3>
          <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 16, fontFamily: "system-ui" }}>
            These show in the Book Info tab on the product page — the more detail, the more sales.
          </p>
          <div className={s.fieldGrid}>
            <div className={s.field}>
              <label>Author</label>
              <input value={form.author} onChange={(e) => onChange("author", e.target.value)} placeholder="e.g. Chinua Achebe" />
            </div>
            <div className={s.field}>
              <label>Publisher</label>
              <input value={form.publisher} onChange={(e) => onChange("publisher", e.target.value)} placeholder="e.g. Penguin Books" />
            </div>
            <div className={s.field}>
              <label>Format</label>
              <select value={form.format} onChange={(e) => onChange("format", e.target.value)}>
                <option value="">Select format</option>
                {BOOK_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label>Language</label>
              <select value={form.language} onChange={(e) => onChange("language", e.target.value)}>
                <option value="">Select language</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label>Number of Pages</label>
              <input type="number" min="1" value={form.pageCount} onChange={(e) => onChange("pageCount", e.target.value)} placeholder="e.g. 209" />
            </div>
            <div className={s.field}>
              <label>Age Range</label>
              <input value={form.ageRange} onChange={(e) => onChange("ageRange", e.target.value)} placeholder="e.g. Adult · 8–12 years · 0–3 years" />
            </div>
            <div className={s.field}>
              <label>ISBN</label>
              <input value={form.isbn} onChange={(e) => onChange("isbn", e.target.value)} placeholder="e.g. 978-0-141-18565-8" />
            </div>
            <div className={s.field}>
              <label>Edition</label>
              <input value={form.edition} onChange={(e) => onChange("edition", e.target.value)} placeholder="e.g. 2nd Edition" />
            </div>
            <div className={s.field}>
              <label>Author's Country / Origin</label>
              <input value={form.origin} onChange={(e) => onChange("origin", e.target.value)} placeholder="e.g. Nigeria, Kenya, Ghana" />
            </div>
            <div className={s.field}>
              <label>Dimensions</label>
              <input value={form.dimensions} onChange={(e) => onChange("dimensions", e.target.value)} placeholder="e.g. 21 × 14 cm" />
            </div>
            <div className={s.field}>
              <label>Weight</label>
              <input value={form.weight} onChange={(e) => onChange("weight", e.target.value)} placeholder="e.g. 320g" />
            </div>
            <div className={s.field}>
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => onChange("tags", e.target.value)} placeholder="e.g. african literature, fiction, award-winning" />
            </div>
          </div>
        </div>
      )}

      {/* ── NON-BOOK PRODUCT DETAILS ─────────────────────────────── */}
      {!isBook && (
        <div className={s.formCard}>
          <h3 className={s.formCardTitle}>Product Details</h3>
          <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 16, fontFamily: "system-ui" }}>
            These appear in the Materials &amp; Care tab on the product page.
          </p>
          <div className={s.fieldGrid}>
            <div className={`${s.field} ${s.fieldFull}`}>
              <label>Materials</label>
              <input value={form.materials} onChange={(e) => onChange("materials", e.target.value)} placeholder="e.g. Sterling silver, hand-dyed glass beads, cotton cord" />
            </div>
            <div className={`${s.field} ${s.fieldFull}`}>
              <label>Care Instructions</label>
              <input value={form.careInfo} onChange={(e) => onChange("careInfo", e.target.value)} placeholder="e.g. Wipe clean with soft cloth. Avoid water and perfume." />
            </div>
            <div className={s.field}>
              <label>Dimensions</label>
              <input value={form.dimensions} onChange={(e) => onChange("dimensions", e.target.value)} placeholder="e.g. Length: 45cm | Pendant: 3cm" />
            </div>
            <div className={s.field}>
              <label>Weight</label>
              <input value={form.weight} onChange={(e) => onChange("weight", e.target.value)} placeholder="e.g. 28g" />
            </div>
            <div className={s.field}>
              <label>Country of Origin</label>
              <input value={form.origin} onChange={(e) => onChange("origin", e.target.value)} placeholder="e.g. Ghana, Nigeria, Kenya" />
            </div>
            <div className={s.field}>
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => onChange("tags", e.target.value)} placeholder="e.g. necklace, beaded, gift, women" />
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGES ───────────────────────────────────────────────── */}
      <div className={s.formCard}>
        <h3 className={s.formCardTitle}>
          {isBook ? "Book Cover & Images" : "Product Images"}
        </h3>
        <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 14, fontFamily: "system-ui" }}>
          {isBook
            ? "Upload front cover first, then back cover and any interior pages."
            : "First image is the main display photo. Add front, back, and detail shots."}
        </p>

        {images.length > 0 && (
          <div className={s.imageGrid} style={{ marginBottom: 14 }}>
            {images.map((url, i) => (
              <div key={i} className={s.imageThumb}>
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                <span style={{
                  position: "absolute", bottom: 3, left: 3,
                  background: "#d4832a", color: "#fff",
                  fontSize: 9, padding: "1px 5px", borderRadius: 3,
                }}>
                  {i === 0 ? (isBook ? "COVER" : "MAIN") : `#${i + 1}`}
                </span>
                <button type="button" className={s.imageThumbRemove} onClick={() => onRemoveImage(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className={s.uploadZone}>
          <input
            type="file" accept="image/*" multiple
            onChange={onImageUpload}
            style={{ display: "none" }}
            disabled={uploadingImages}
          />
          <div style={{ fontSize: 28 }}>{uploadingImages ? "⏳" : isBook ? "📖" : "📷"}</div>
          <p className={s.uploadZoneText}>
            {uploadingImages ? "Uploading images..." : "Click to upload images"}
          </p>
          <p style={{ fontSize: 12, color: "#b86820", marginTop: 4 }}>
            JPG, PNG, WebP · Max 10MB each · Upload multiple at once
          </p>
        </label>
      </div>

      {/* ── VIDEO ────────────────────────────────────────────────── */}
      <div className={s.formCard}>
        <h3 className={s.formCardTitle}>
          {isBook ? "Book Preview Video" : "Product Video"}
          <span style={{ fontSize: 12, fontWeight: 400, color: "#b86820", marginLeft: 8 }}>(optional)</span>
        </h3>
        <p style={{ fontSize: 13, color: "#7a3f1d", marginBottom: 14, fontFamily: "system-ui" }}>
          {isBook
            ? "A short clip flipping through pages or a reading excerpt can increase sales."
            : "Upload a video — the URL is set automatically from Cloudinary. Even 15 seconds helps."}
        </p>

        {videoUrl && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: "hidden", border: "1px solid #f4dbb0" }}>
            <video src={videoUrl} controls style={{ width: "100%", maxHeight: 200, background: "#000", display: "block" }} />
            <div style={{ padding: "10px 14px", background: "#faefd9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#22c55e", fontFamily: "system-ui", fontWeight: 600 }}>
                ✅ Video uploaded to Cloudinary
              </span>
              <button type="button" onClick={onRemoveVideo}
                style={{ fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "system-ui" }}>
                Remove
              </button>
            </div>
          </div>
        )}

        <label className={s.uploadZone}>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/avi"
            onChange={onVideoUpload}
            style={{ display: "none" }}
            disabled={uploadingVideo}
          />
          {uploadingVideo ? (
            <>
              <div style={{ fontSize: 28 }}>⏳</div>
              <p className={s.uploadZoneText}>Uploading video to Cloudinary...</p>
              <p style={{ fontSize: 12, color: "#b86820", marginTop: 4 }}>This may take a moment</p>
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
    </>
  );
}
