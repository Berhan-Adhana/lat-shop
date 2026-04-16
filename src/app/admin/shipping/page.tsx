// src/app/admin/shipping/page.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import s from "../admin.module.css";

interface ShippingZone {
  id: string; name: string; countries: string[];
  rate: number; freeOver: number | null; isActive: boolean;
}

export default function AdminShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", countries: "", rate: "", freeOver: "", isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/shipping/all")
      .then((r) => r.json())
      .then((data) => { setZones(data); setLoading(false); })
      .catch(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const startEdit = (zone: ShippingZone) => {
    setEditId(zone.id);
    setEditForm({
      name: zone.name,
      countries: zone.countries.join(", "),
      rate: String(zone.rate),
      freeOver: zone.freeOver ? String(zone.freeOver) : "",
      isActive: zone.isActive,
    });
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/shipping/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          countries: editForm.countries.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean),
          rate: Number(editForm.rate),
          freeOver: editForm.freeOver ? Number(editForm.freeOver) : null,
          isActive: editForm.isActive,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Shipping zone updated!");
      setEditId(null);
      load();
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Shipping Zones</h1>
          <p className={s.pageSubtitle}>Edit rates and countries per zone</p>
        </div>
      </div>

      {/* Help text */}
      <div style={{ background: "#faefd9", border: "1px solid #ecc07f", borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: "#7a3f1d", fontFamily: "system-ui" }}>
        <strong>Country codes:</strong> Use ISO 2-letter codes separated by commas.
        Examples: <code>CA</code> for Canada, <code>US</code> for United States,
        <code>GB, FR, DE, IT, ES, NL</code> for Europe.
        <br />
        <strong>Free over:</strong> If order subtotal exceeds this amount, shipping is free. Leave empty to disable.
      </div>

      <div className={s.tableWrap}>
        <div className={s.tableHeader}>
          <span className={s.tableTitle}>All Shipping Zones</span>
        </div>
        {loading ? (
          <div className={s.emptyState}><p>Loading...</p></div>
        ) : zones.length === 0 ? (
          <div className={s.emptyState}>
            <p>No shipping zones. Run <code>npm run db:seed</code> to create defaults.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Countries</th>
                  <th>Flat Rate (CA$)</th>
                  <th>Free Shipping Over</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    {editId === zone.id ? (
                      // ── Edit row ──
                      <>
                        <td>
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            style={{ padding: "7px 10px", border: "1.5px solid #d4832a", borderRadius: 6, fontSize: 14, width: "100%", outline: "none" }}
                          />
                        </td>
                        <td>
                          <input
                            value={editForm.countries}
                            onChange={(e) => setEditForm({ ...editForm, countries: e.target.value })}
                            placeholder="CA, US, GB"
                            style={{ padding: "7px 10px", border: "1.5px solid #ecc07f", borderRadius: 6, fontSize: 13, width: "100%", outline: "none", fontFamily: "monospace" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number" step="0.01" min="0"
                            value={editForm.rate}
                            onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                            style={{ padding: "7px 10px", border: "1.5px solid #ecc07f", borderRadius: 6, fontSize: 14, width: 90, outline: "none" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number" step="0.01" min="0"
                            value={editForm.freeOver}
                            onChange={(e) => setEditForm({ ...editForm, freeOver: e.target.value })}
                            placeholder="None"
                            style={{ padding: "7px 10px", border: "1.5px solid #ecc07f", borderRadius: 6, fontSize: 14, width: 90, outline: "none" }}
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.isActive ? "true" : "false"}
                            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
                            style={{ padding: "7px 10px", border: "1.5px solid #ecc07f", borderRadius: 6, fontSize: 13 }}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <div className={s.actions}>
                            <button className={`${s.btnPrimary} ${s.btnSm}`} onClick={() => handleSave(zone.id)} disabled={saving}>
                              {saving ? "..." : "Save"}
                            </button>
                            <button className={`${s.btnSecondary} ${s.btnSm}`} onClick={() => setEditId(null)}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // ── Display row ──
                      <>
                        <td style={{ fontWeight: 600 }}>{zone.name}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12, color: "#3d2b14" }}>
                          {zone.countries.join(", ")}
                        </td>
                        <td style={{ fontWeight: 700, color: "#d4832a" }}>CA${zone.rate.toFixed(2)}</td>
                        <td style={{ fontSize: 13, color: "#22c55e" }}>
                          {zone.freeOver ? `CA$${zone.freeOver.toFixed(2)}` : "—"}
                        </td>
                        <td>
                          <span className={`${s.badge} ${zone.isActive ? s.badgeActive : s.badgeInactive}`}>
                            {zone.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button className={`${s.btnSecondary} ${s.btnSm}`} onClick={() => startEdit(zone)}>
                            Edit
                          </button>
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
