// src/app/admin/orders/page.tsx
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import s from "../admin.module.css";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: { select: { quantity: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    PENDING: s.badgePending, PROCESSING: s.badgeProcessing,
    SHIPPED: s.badgeShipped, DELIVERED: s.badgeDelivered,
    CANCELLED: s.badgeCancelled, REFUNDED: s.badgeRefunded,
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Orders</h1>
          <p className={s.pageSubtitle}>{orders.length} total orders</p>
        </div>
      </div>

      <div className={s.tableWrap}>
        <div className={s.tableHeader}>
          <span className={s.tableTitle}>All Orders</span>
        </div>
        {orders.length === 0 ? (
          <div className={s.emptyState}><p>No orders yet.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Tracking</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.user.name}</div>
                      <div style={{ fontSize: 12, color: "#7a3f1d" }}>{order.user.email}</div>
                    </td>
                    <td>{order.items.reduce((a, i) => a + i.quantity, 0)} items</td>
                    <td style={{ fontWeight: 600, color: "#d4832a" }}>CA${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`${s.badge} ${order.paymentStatus === "PAID" ? s.badgePaid : s.badgeUnpaid}`}>
                        {order.paymentStatus}
                      </span>
                      <div style={{ fontSize: 11, color: "#7a3f1d", marginTop: 2 }}>{order.paymentMethod}</div>
                    </td>
                    <td>
                      <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td>
                      {order.trackingNumber ? (
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#3d2b14" }}>{order.trackingNumber}</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#b86820" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "#7a3f1d" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
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
