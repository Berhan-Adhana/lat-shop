// src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import s from "../admin.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newForm, setNewForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  // ── Create ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Category created!");
      setNewForm({ name: "", description: "" });
      setShowNew(false);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  // ── Start editing ──
  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditForm({
      name: cat.name,
      description: cat.description ?? "",
      isActive: cat.isActive,
    });
  };

  // ── Save edit ──
  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Category updated!");
      setEditId(null);
      load();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Delete category "${name}"? Products in this category must be reassigned first.`,
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Category deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Categories</h1>
          <p className={s.pageSubtitle}>{categories.length} categories</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowNew(!showNew)}>
          {showNew ? "Cancel" : "+ New Category"}
        </button>
      </div>

      {/* Create form */}
      {showNew && (
        <div className={s.formCard} style={{ marginBottom: 24 }}>
          <h3 className={s.formCardTitle}>New Category</h3>
          <form onSubmit={handleCreate}>
            <div className={s.fieldGrid}>
              <div className={s.field}>
                <label>Name *</label>
                <input
                  value={newForm.name}
                  onChange={(e) =>
                    setNewForm({ ...newForm, name: e.target.value })
                  }
                  placeholder="e.g. Jewelry"
                  required
                />
              </div>
              <div className={s.field}>
                <label>Description</label>
                <input
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button type="submit" className={s.btnPrimary} disabled={saving}>
                {saving ? "Creating..." : "Create Category"}
              </button>
              <button
                type="button"
                className={s.btnSecondary}
                onClick={() => setShowNew(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories table */}
      <div className={s.tableWrap}>
        <div className={s.tableHeader}>
          <span className={s.tableTitle}>All Categories</span>
        </div>
        {loading ? (
          <div className={s.emptyState}>
            <p>Loading...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={s.emptyState}>
            <p>No categories yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    {editId === cat.id ? (
                      // ── Inline edit row ──
                      <>
                        <td>
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            style={{
                              padding: "7px 10px",
                              border: "1.5px solid #d4832a",
                              borderRadius: 6,
                              fontSize: 14,
                              width: "100%",
                              outline: "none",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: "#7a3f1d",
                          }}
                        >
                          {editForm.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}
                        </td>
                        <td>
                          <input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description"
                            style={{
                              padding: "7px 10px",
                              border: "1.5px solid #ecc07f",
                              borderRadius: 6,
                              fontSize: 14,
                              width: "100%",
                              outline: "none",
                            }}
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.isActive ? "true" : "false"}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                isActive: e.target.value === "true",
                              })
                            }
                            style={{
                              padding: "7px 10px",
                              border: "1.5px solid #ecc07f",
                              borderRadius: 6,
                              fontSize: 14,
                            }}
                          >
                            <option value="true">Active</option>
                            <option value="false">Hidden</option>
                          </select>
                        </td>
                        <td>
                          <div className={s.actions}>
                            <button
                              className={`${s.btnPrimary} ${s.btnSm}`}
                              onClick={() => handleSaveEdit(cat.id)}
                              disabled={saving}
                            >
                              {saving ? "..." : "Save"}
                            </button>
                            <button
                              className={`${s.btnSecondary} ${s.btnSm}`}
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // ── Display row ──
                      <>
                        <td style={{ fontWeight: 600 }}>{cat.name}</td>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: "#7a3f1d",
                          }}
                        >
                          {cat.slug}
                        </td>
                        <td style={{ fontSize: 13, color: "#7a3f1d" }}>
                          {cat.description ?? "—"}
                        </td>
                        <td>
                          <span
                            className={`${s.badge} ${cat.isActive ? s.badgeActive : s.badgeInactive}`}
                          >
                            {cat.isActive ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td>
                          <div className={s.actions}>
                            <button
                              className={`${s.btnSecondary} ${s.btnSm}`}
                              onClick={() => startEdit(cat)}
                            >
                              Edit
                            </button>
                            <button
                              className={`${s.btnDanger} ${s.btnSm}`}
                              onClick={() => handleDelete(cat.id, cat.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
