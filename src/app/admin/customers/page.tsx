// src/app/admin/customers/page.tsx
import prisma from "@/lib/db/prisma";
import s from "../admin.module.css";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Customers</h1>
          <p className={s.pageSubtitle}>{customers.length} registered customers</p>
        </div>
      </div>

      <div className={s.tableWrap}>
        <div className={s.tableHeader}><span className={s.tableTitle}>All Customers</span></div>
        {customers.length === 0 ? (
          <div className={s.emptyState}><p>No customers yet.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr><th>Customer</th><th>Email</th><th>Phone</th><th>Orders</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #d4832a, #b86820)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                          {customer.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{customer.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#7a3f1d" }}>{customer.email}</td>
                    <td>{customer.phone ?? "—"}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: customer._count.orders > 0 ? "#d4832a" : "#7a3f1d" }}>
                        {customer._count.orders}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "#7a3f1d" }}>
                      {new Date(customer.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
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
