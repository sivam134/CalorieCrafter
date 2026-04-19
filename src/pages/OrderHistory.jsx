import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import Navbar from "../components/Navbar";
import "./OrderHistory.css";

const STEPS = [
  { key: "confirmed", icon: "✓", label: "Confirmed" },
  { key: "preparing", icon: "🍳", label: "Preparing" },
  { key: "on_the_way", icon: "🛵", label: "On the Way" },
  { key: "delivered", icon: "🏠", label: "Delivered" },
];

const STATUS_MAP = {
  pending: {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Pending",
    step: 0,
  },
  confirmed: {
    color: "#4f46e5",
    bg: "#eef2ff",
    border: "#c7d2fe",
    label: "Confirmed",
    step: 1,
  },
  preparing: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Preparing",
    step: 2,
  },
  on_the_way: {
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    label: "On the Way",
    step: 3,
  },
  delivered: {
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "Delivered",
    step: 4,
  },
  cancelled: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Cancelled",
    step: -1,
  },
};

export default function OrderHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(data);
        if (data.length) setSelectedOrder(data[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const getMeta = (s) =>
    STATUS_MAP[s] || {
      color: "#64748b",
      bg: "#f8fafc",
      border: "#e2e8f0",
      label: s,
      step: 0,
    };
  const fmtDate = (o) =>
    o?.createdAt?.seconds
      ? new Date(o.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";
  const fmtTime = (o) =>
    o?.createdAt?.seconds
      ? new Date(o.createdAt.seconds * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const getETA = (o) => {
    if (!o?.createdAt?.seconds) return "—";
    const eta = new Date(o.createdAt.seconds * 1000 + 35 * 60 * 1000);
    return eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar currentUser={currentUser} />
        <div className="oh-loading">
          <div className="oh-spin" />
          <p>Fetching your orders…</p>
        </div>
      </>
    );
  }

  /* ── Empty ── */
  if (!orders.length) {
    return (
      <>
        <Navbar currentUser={currentUser} />
        <div className="oh-empty">
          <div className="oh-empty-icon">🍽️</div>
          <h2>No orders yet</h2>
          <p>Your delicious journey starts here.</p>
          <a href="/menu" className="oh-empty-cta">
            Explore Menu →
          </a>
        </div>
      </>
    );
  }

  const sel = selectedOrder;
  const meta = sel ? getMeta(sel.status) : null;
  const activeStep = meta?.step ?? 0;

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="oh-root">
        {/* ── Sidebar ── */}
        <aside className="oh-sidebar">
          <div className="oh-sidebar-hdr">
            <span className="oh-sidebar-title">My Orders</span>
            <span className="oh-count">{orders.length}</span>
          </div>

          <div className="oh-list">
            {orders.map((order) => {
              const m = getMeta(order.status);
              const active = sel?.id === order.id;
              return (
                <button
                  key={order.id}
                  className={`oh-list-item ${active ? "oh-list-item--on" : ""}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  {active && <div className="oh-list-bar" />}
                  <div className="oh-list-top">
                    <span className="oh-list-id">
                      #{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span
                      className="oh-list-badge"
                      style={{
                        color: m.color,
                        background: m.bg,
                        borderColor: m.border,
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                  <div className="oh-list-btm">
                    <span className="oh-list-date">
                      {fmtDate(order)} · {fmtTime(order)}
                    </span>
                    <span className="oh-list-price">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Detail ── */}
        {sel && (
          <main className="oh-detail">
            {/* Hero */}
            <div className="oh-hero">
              <div className="oh-hero-left">
                <p className="oh-hero-eye">Order</p>
                <h1 className="oh-hero-id">
                  #{sel.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="oh-hero-date">
                  {fmtDate(sel)} at {fmtTime(sel)}
                </p>
              </div>
              <div className="oh-hero-right">
                <div
                  className="oh-status-pill"
                  style={{
                    color: meta.color,
                    background: meta.bg,
                    borderColor: meta.border,
                  }}
                >
                  <span
                    className="oh-status-dot"
                    style={{ background: meta.color }}
                  />
                  {meta.label}
                </div>
                {sel.status !== "delivered" && sel.status !== "cancelled" && (
                  <div className="oh-eta">
                    <span className="oh-eta-lbl">Estimated Arrival</span>
                    <span className="oh-eta-val">{getETA(sel)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tracker */}
            {sel.status !== "cancelled" && (
              <div className="oh-card">
                <h3 className="oh-card-title">Live Tracking</h3>
                <div className="oh-tracker">
                  {STEPS.map((s, i) => {
                    const done =
                      activeStep > i + 1 || (activeStep === 4 && i <= 3);
                    const isAct = activeStep === i + 1;
                    return (
                      <React.Fragment key={s.key}>
                        <div
                          className={`oh-tstep ${
                            done || activeStep > i ? "oh-tstep--done" : ""
                          } ${isAct ? "oh-tstep--active" : ""}`}
                        >
                          {isAct && <span className="oh-tnow">Now</span>}
                          <div className="oh-tcircle">
                            {activeStep > i + 1 || activeStep === 4
                              ? "✓"
                              : s.icon}
                          </div>
                          <span className="oh-tlabel">{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`oh-tline ${
                              activeStep > i + 1 || activeStep === 4
                                ? "oh-tline--done"
                                : ""
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {sel.status !== "delivered" && (
                  <div className="oh-rider">
                    <span className="oh-rider-av">🛵</span>
                    <div>
                      <p className="oh-rider-name">
                        Rider: <strong>{sel.riderName || "Rahul K."}</strong>
                      </p>
                      <p className="oh-rider-ph">
                        {sel.riderPhone || "+91 98765 43210"}
                      </p>
                    </div>
                    <a
                      href={`tel:${sel.riderPhone || "+919876543210"}`}
                      className="oh-call"
                    >
                      Call Rider
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Items */}
            <div className="oh-card">
              <h3 className="oh-card-title">Items Ordered</h3>
              <div className="oh-items">
                {sel.items?.map((item, i) => (
                  <div key={i} className="oh-item">
                    <div className="oh-item-img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>🍱</span>
                      )}
                    </div>
                    <div className="oh-item-info">
                      <p className="oh-item-name">{item.name}</p>
                      <div className="oh-item-chips">
                        <span className="oh-ichip oh-ichip--cal">
                          🔥 {item.calories * item.quantity} kcal
                        </span>
                        {item.protein && (
                          <span className="oh-ichip oh-ichip--pro">
                            💪 {item.protein * item.quantity}g
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="oh-item-right">
                      <span className="oh-item-qty">×{item.quantity}</span>
                      <span className="oh-item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition + Bill */}
            <div className="oh-twin">
              <div className="oh-card">
                <h3 className="oh-card-title">Nutrition</h3>
                <div className="oh-nut-grid">
                  {[
                    {
                      icon: "🔥",
                      label: "Calories",
                      val: `${sel.totalCalories} kcal`,
                    },
                    {
                      icon: "💪",
                      label: "Protein",
                      val: `${sel.totalProtein || "—"}g`,
                    },
                    {
                      icon: "🍞",
                      label: "Carbs",
                      val: `${sel.totalCarbs || "—"}g`,
                    },
                    {
                      icon: "🥑",
                      label: "Fats",
                      val: `${sel.totalFats || "—"}g`,
                    },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="oh-nut-chip">
                      <span className="oh-nut-icon">{icon}</span>
                      <span className="oh-nut-val">{val}</span>
                      <span className="oh-nut-lbl">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="oh-card">
                <h3 className="oh-card-title">Bill Details</h3>
                <div className="oh-bill">
                  <div className="oh-bill-row">
                    <span>Subtotal</span>
                    <span>
                      ₹
                      {(
                        sel.totalAmount -
                        49 -
                        (sel.totalAmount * 0.05) / 1.05
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="oh-bill-row">
                    <span>Delivery</span>
                    <span>₹49.00</span>
                  </div>
                  <div className="oh-bill-row">
                    <span>GST (5%)</span>
                    <span>
                      ₹{(((sel.totalAmount - 49) * 0.05) / 1.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="oh-bill-div" />
                  <div className="oh-bill-row oh-bill-total">
                    <span>Total Paid</span>
                    <span>₹{sel.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="oh-bill-pay">
                    <span>Payment via</span>
                    <span style={{ color: "#16a34a" }}>
                      {sel.paymentMethod || "Online"} ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="oh-card">
              <h3 className="oh-card-title">Delivery Address</h3>
              <div className="oh-address">
                <span className="oh-address-pin">📍</span>
                <p>{sel.deliveryAddress || "—"}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="oh-actions">
              <button className="oh-reorder">🔁 Reorder</button>
              <button className="oh-help">Need Help?</button>
            </div>
          </main>
        )}
      </div>
    </>
  );
}
