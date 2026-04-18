// src/app/(account)/account/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AccountNav from "@/components/account/AccountNav";
import s from "../account.module.css";

const statusColors: Record<string, string> = {
  PENDING: s.badgePending, PROCESSING: s.badgeProcessing,
  SHIPPED: s.badgeShipped, DELIVERED: s.badgeDelivered,
  CANCELLED: s.badgeCancelled, REFUNDED: s.badgeRefunded,
};
const statusIcons: Record<string, string> = {
  PENDING: "⏳", PROCESSING: "📋", SHIPPED: "🚚",
  DELIVERED: "✅", CANCELLED: "❌", REFUNDED: "↩️",
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?callbackUrl=/account/orders");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || loading) return (
    <div className={s.page}><div className={s.loading}><div className={s.spinner} /></div></div>
  );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>

        <AccountNav />

        <div className={s.layout}>
          <div className={s.sidebar} />
          <div className={s.main}>
            {orders.length === 0 ? (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}>🛍️</div>
                <h3>No orders yet</h3>
                <p>Your orders will appear here once you make a purchase.</p>
                <Link href="/shop" className={s.btnPrimary}>Start Shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className={s.orderCard}>
                  {/* Header */}
                  <div className={s.orderHeader}>
                    <div>
                      <div className={s.orderId}>#{order.id.slice(-8).toUpperCase()}</div>
                      <div className={s.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString("en-CA", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className={s.orderMeta}>
                      <span className={`${s.badge} ${statusColors[order.status] ?? ""}`}>
                        {statusIcons[order.status]} {order.status}
                      </span>
                      <span className={s.orderTotal}>CA${order.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className={s.orderItems}>
                    {order.items?.slice(0, 2).map((item: any) => (
                      <div key={item.id} className={s.orderItem}>
                        <div className={s.orderItemImg}>
                          {item.product?.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#ecc07f" }}>L</div>
                          )}
                        </div>
                        <div>
                          <div className={s.orderItemName}>{item.product?.name}</div>
                          <div className={s.orderItemQty}>Qty {item.quantity} · CA${item.price?.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p style={{ fontSize: 12, color: "#7a3f1d" }}>+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={s.orderFooter}>
                    <div className={s.trackingInfo}>
                      {order.trackingNumber ? (
                        <>🚚 <span className={s.trackingNum}>{order.trackingNumber}</span></>
                      ) : (
                        <span style={{ color: "#b86820" }}>{order.paymentMethod?.toUpperCase()}</span>
                      )}
                    </div>
                    {order.trackingNumber && (
                      <a
                        href={`https://www.canadapost-postescanada.ca/track-reperer/alternate?execution=e1s1&lang=en&totalSearch=true&searchFor=${order.trackingNumber}`}
                        target="_blank" rel="noopener noreferrer"
                        className={s.btnSecondary}
                        style={{ fontSize: 12, padding: "5px 10px" }}
                      >
                        Track
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
