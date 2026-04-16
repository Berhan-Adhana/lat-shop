// src/app/admin/page.tsx
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import s from "./admin.module.css";

async function getStats() {
  const [
    totalRevenue, totalOrders, totalCustomers, totalProducts,
    revenueToday, ordersToday, recentOrders, ordersByStatus, topProducts,
  ] = await Promise.all([
    // Total revenue (paid orders)
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    // Total orders
    prisma.order.count(),
    // Total customers
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    // Total products
    prisma.product.count({ where: { isActive: true } }),
    // Revenue today
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      _sum: { total: true },
    }),
    // Orders today
    prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    // Recent orders
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
    }),
    // Orders by status
    prisma.order.groupBy({ by: ["status"], _count: true }),
    // Top products by units sold
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueToday: revenueToday._sum.total ?? 0,
    ordersToday,
    recentOrders,
    ordersByStatus,
    topProducts,
  };
}

const statusColors: Record<string, string> = {
  PENDING: s.badgePending,
  PROCESSING: s.badgeProcessing,
  SHIPPED: s.badgeShipped,
  DELIVERED: s.badgeDelivered,
  CANCELLED: s.badgeCancelled,
  REFUNDED: s.badgeRefunded,
};

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Dashboard</h1>
          <p className={s.pageSubtitle}>Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/admin/products/new" className={s.btnPrimary}>
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className={s.statsGrid}>
        {[
          { icon: "💰", label: "Total Revenue", value: `CA$${stats.totalRevenue.toFixed(2)}`, sub: `CA$${stats.revenueToday.toFixed(2)} today` },
          { icon: "🛍️", label: "Total Orders", value: stats.totalOrders.toString(), sub: `${stats.ordersToday} today` },
          { icon: "👥", label: "Customers", value: stats.totalCustomers.toString(), sub: "registered accounts" },
          { icon: "📦", label: "Products", value: stats.totalProducts.toString(), sub: "active listings" },
        ].map((stat) => (
          <div key={stat.label} className={s.statCard}>
            <div className={s.statIcon}>{stat.icon}</div>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={s.statValue}>{stat.value}</div>
            <div className={s.statSub}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div className={s.statsGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 28 }}>
        {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => {
          const count = stats.ordersByStatus.find((s: any) => s.status === status)?._count ?? 0;
          return (
            <div key={status} className={s.statCard}>
              <div className={s.statLabel}>{status}</div>
              <div className={s.statValue} style={{ fontSize: 22 }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className={s.tableWrap}>
        <div className={s.tableHeader}>
          <span className={s.tableTitle}>Recent Orders</span>
          <Link href="/admin/orders" className={s.btnSecondary}>View All</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className={s.emptyState}><p>No orders yet</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>#{order.id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.user.name}</div>
                      <div style={{ fontSize: 12, color: "#7a3f1d" }}>{order.user.email}</div>
                    </td>
                    <td>{order.items.reduce((a: number, i: any) => a + i.quantity, 0)} items</td>
                    <td style={{ fontWeight: 600, color: "#d4832a" }}>CA${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`${s.badge} ${statusColors[order.status] ?? ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "#7a3f1d" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <Link href={`/admin/orders/${order.id}`} className={`${s.btnSecondary} ${s.btnSm}`}>
                        View
                      </Link>
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
