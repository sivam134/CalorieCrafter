import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const NutritionBar = ({ label, value, max, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="ct-nb-row">
      <div className="ct-nb-head">
        <span>{label}</span>
        <span>{value}g</span>
      </div>
      <div className="ct-nb-track">
        <div
          className="ct-nb-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

export default function Cart() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const {
    cartItems,
    totalCalories,
    totalAmount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [expanded, setExpanded] = useState(null);
  const [removing, setRemoving] = useState(null);

  const dailyTarget = userProfile?.dailyCalorieTarget || 2000;
  const consumed = userProfile?.dailyCaloriesConsumed || 0;
  const remaining = dailyTarget - (consumed + totalCalories);
  const isOver = remaining < 0;
  const calPct = Math.min((totalCalories / dailyTarget) * 100, 100);

  const totalProtein = cartItems.reduce(
    (s, i) => s + (i.protein || 0) * i.quantity,
    0
  );
  const totalCarbs = cartItems.reduce(
    (s, i) => s + (i.carbs || 0) * i.quantity,
    0
  );
  const totalFats = cartItems.reduce(
    (s, i) => s + (i.fats || 0) * i.quantity,
    0
  );

  const deliveryFee = 49;
  const tax = totalAmount * 0.05;
  const grandTotal = totalAmount + deliveryFee + tax;

  const handleQty = (id, next) => {
    if (next < 1) {
      handleRemove(id);
      return;
    }
    updateQuantity(id, next);
  };

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemoving(null);
      if (expanded === id) setExpanded(null);
    }, 280);
  };

  const handleCheckout = () => {
    if (!cartItems.length) return;
    if (isOver) {
      if (
        !window.confirm(
          `⚠️ You're ${Math.abs(
            remaining
          )} kcal over your daily goal. Continue?`
        )
      )
        return;
    }
    navigate("/checkout");
  };

  /* ── EMPTY STATE ── */
  if (!cartItems.length) {
    return (
      <div className="ct-empty">
        <div className="ct-empty-inner">
          <div className="ct-empty-icon">🥗</div>
          <h2>Your cart is empty</h2>
          <p>Pick some nourishing meals and build your perfect order.</p>
          <Link to="/menu" className="ct-empty-btn">
            Browse Menu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-root">
      <div className="ct-page">
        {/* ═══ LEFT COLUMN ═══ */}
        <div className="ct-left">
          {/* Page header */}
          <div className="ct-hdr">
            <div>
              <p className="ct-hdr-eye">Your Selection</p>
              <h1 className="ct-hdr-title">
                My Cart
                <span className="ct-hdr-badge">{cartItems.length}</span>
              </h1>
            </div>
            <button className="ct-hdr-clear" onClick={clearCart}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear all
            </button>
          </div>

          {/* Item cards */}
          <div className="ct-items">
            {cartItems.map((item, idx) => {
              const isExp = expanded === item.id;
              const isRem = removing === item.id;
              const itotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className={`ct-card ${isExp ? "ct-card--exp" : ""} ${
                    isRem ? "ct-card--rem" : ""
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* ── Main row ── */}
                  <div className="ct-card-row">
                    {/* Food image */}
                    <div className="ct-card-img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="ct-card-img-fb">🍱</span>
                      )}
                      <span className="ct-card-qty-dot">{item.quantity}</span>
                    </div>

                    {/* Info */}
                    <div className="ct-card-body">
                      <div className="ct-card-top">
                        <div>
                          <h3 className="ct-card-name">{item.name}</h3>
                          <p className="ct-card-rest">{item.restaurantName}</p>
                        </div>
                        <button
                          className="ct-del-btn"
                          onClick={() => handleRemove(item.id)}
                          title="Remove item"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Macro chips */}
                      <div className="ct-chips">
                        <span className="ct-chip ct-chip--cal">
                          🔥 {item.calories} kcal
                        </span>
                        <span className="ct-chip ct-chip--pro">
                          💪 {item.protein}g
                        </span>
                        <span className="ct-chip ct-chip--carb">
                          🍞 {item.carbs}g
                        </span>
                        <span className="ct-chip ct-chip--fat">
                          🥑 {item.fats}g
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="ct-ctrl">
                        {/* Qty stepper */}
                        <div className="ct-stepper">
                          <button
                            className="ct-step"
                            onClick={() =>
                              handleQty(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="ct-step-n">{item.quantity}</span>
                          <button
                            className="ct-step ct-step--plus"
                            onClick={() =>
                              handleQty(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Per-item price */}
                        <div className="ct-item-price">
                          <span className="ct-item-price-unit">
                            ₹{item.price} × {item.quantity}
                          </span>
                          <span className="ct-item-price-total">
                            ₹{itotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Details expand */}
                        <button
                          className={`ct-exp-btn ${
                            isExp ? "ct-exp-btn--open" : ""
                          }`}
                          onClick={() => setExpanded(isExp ? null : item.id)}
                        >
                          Details
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded drawer ── */}
                  {isExp && (
                    <div className="ct-drawer">
                      <div className="ct-drawer-grid">
                        {/* Ingredients */}
                        <div>
                          <p className="ct-drawer-lbl">Ingredients</p>
                          <div className="ct-ings">
                            {(
                              item.ingredients || [
                                "Whole grain",
                                "Olive oil",
                                "Fresh herbs",
                                "Sea salt",
                                "Lemon",
                                "Garlic",
                              ]
                            ).map((ing, i) => (
                              <span key={i} className="ct-ing">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Nutrition bars */}
                        <div>
                          <p className="ct-drawer-lbl">Nutrition per serving</p>
                          <div className="ct-nbars">
                            <NutritionBar
                              label="Protein"
                              value={item.protein}
                              max={60}
                              color="#6366f1"
                            />
                            <NutritionBar
                              label="Carbs"
                              value={item.carbs}
                              max={100}
                              color="#f59e0b"
                            />
                            <NutritionBar
                              label="Fats"
                              value={item.fats}
                              max={60}
                              color="#16a34a"
                            />
                          </div>
                        </div>
                      </div>

                      {item.tags && (
                        <div className="ct-tags">
                          {item.tags.map((t, i) => (
                            <span key={i} className="ct-tag">
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Link to="/menu" className="ct-back-link">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <div className="ct-right">
          {/* Calorie tracker */}
          <div className={`ct-cal-card ${isOver ? "ct-cal-card--over" : ""}`}>
            <div className="ct-cal-row">
              <div>
                <p className="ct-sec-lbl">Daily Calorie Goal</p>
                <div className="ct-cal-nums">
                  <span
                    style={{ color: isOver ? "#ef4444" : "#16a34a" }}
                    className="ct-cal-used"
                  >
                    {totalCalories}
                  </span>
                  <span className="ct-cal-sep"> / </span>
                  <span className="ct-cal-max">{dailyTarget} kcal</span>
                </div>
              </div>
              {isOver && (
                <div className="ct-over-pill">⚠ {Math.abs(remaining)} over</div>
              )}
            </div>
            <div className="ct-cal-track">
              <div
                className="ct-cal-fill"
                style={{
                  width: `${calPct}%`,
                  background: isOver
                    ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                    : "linear-gradient(90deg,#22c55e,#16a34a)",
                }}
              />
            </div>
            {!isOver && (
              <p className="ct-cal-rem">{remaining} kcal remaining today</p>
            )}
          </div>

          {/* Nutrition summary */}
          <div className="ct-nut-card">
            <p className="ct-sec-lbl">Total Nutrition</p>
            <div className="ct-nut-grid">
              {[
                {
                  icon: "🔥",
                  v: totalCalories,
                  u: "kcal",
                  l: "Calories",
                  c: "#f97316",
                },
                {
                  icon: "💪",
                  v: totalProtein,
                  u: "g",
                  l: "Protein",
                  c: "#6366f1",
                },
                { icon: "🍞", v: totalCarbs, u: "g", l: "Carbs", c: "#d97706" },
                { icon: "🥑", v: totalFats, u: "g", l: "Fats", c: "#16a34a" },
              ].map(({ icon, v, u, l, c }) => (
                <div key={l} className="ct-nut-chip" style={{ "--cc": c }}>
                  <span className="ct-nut-icon">{icon}</span>
                  <span className="ct-nut-val">
                    {v}
                    <small>{u}</small>
                  </span>
                  <span className="ct-nut-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill breakdown */}
          <div className="ct-bill">
            <p className="ct-sec-lbl">Bill Summary</p>

            <div className="ct-bill-items">
              {cartItems.map((item) => (
                <div key={item.id} className="ct-bill-row">
                  <span className="ct-bill-name">
                    {item.name}
                    <span className="ct-bill-q"> ×{item.quantity}</span>
                  </span>
                  <span className="ct-bill-amt">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="ct-bill-div" />

            <div className="ct-bill-fees">
              <div className="ct-bill-fee-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="ct-bill-fee-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="ct-bill-fee-row">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="ct-bill-total">
              <span>Total</span>
              <span className="ct-bill-grand">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button className="ct-checkout-btn" onClick={handleCheckout}>
            <span>Proceed to Checkout</span>
            <span className="ct-checkout-price">₹{grandTotal.toFixed(2)}</span>
          </button>

          {/* Trust badges */}
          <div className="ct-trust">
            {[
              ["🔒", "Secure Pay"],
              ["⚡", "30 min"],
              ["🌿", "Fresh & Healthy"],
            ].map(([icon, label]) => (
              <div key={label} className="ct-trust-badge">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
