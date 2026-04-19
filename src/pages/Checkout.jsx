import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import "./Checkout.css";

const STEPS = ["Delivery", "Payment", "Review"];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, totalCalories, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();

  const [step, setStep] = useState(0); // 0 = delivery, 1 = payment, 2 = review
  const [loading, setLoading] = useState(false);

  const deliveryFee = 49;
  const tax = totalAmount * 0.05;
  const grandTotal = totalAmount + deliveryFee + tax;

  const [form, setForm] = useState({
    name: userProfile?.name || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onChange = (e) => set(e.target.name, e.target.value);

  const handleNext = () => setStep((s) => Math.min(s + 1, 2));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handlePlace = async () => {
    setLoading(true);
    try {
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

      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        items: cartItems,
        totalAmount: grandTotal,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats,
        deliveryAddress: `${form.address}, ${form.city} — ${form.zipCode}`,
        contactName: form.name,
        contactPhone: form.phone,
        paymentMethod: form.paymentMethod,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("❌ Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="ck-root">
      <div className="ck-page">
        {/* ═══ LEFT ═══ */}
        <div className="ck-left">
          {/* Breadcrumb stepper */}
          <div className="ck-steps">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`ck-step ${i < step ? "ck-step--done" : ""} ${
                    i === step ? "ck-step--active" : ""
                  }`}
                >
                  <div className="ck-step-circle">
                    {i < step ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <span className="ck-step-label">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`ck-step-line ${
                      i < step ? "ck-step-line--done" : ""
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── STEP 0: Delivery ── */}
          {step === 0 && (
            <div className="ck-section">
              <div className="ck-sec-hdr">
                <span className="ck-sec-icon">📍</span>
                <div>
                  <h2 className="ck-sec-title">Delivery Details</h2>
                  <p className="ck-sec-sub">
                    Where should we bring your order?
                  </p>
                </div>
              </div>

              <div className="ck-fields">
                <div className="ck-field">
                  <label>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. Arjun Sharma"
                    required
                  />
                </div>
                <div className="ck-field">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="ck-field ck-field--full">
                  <label>Street Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="House no., Street, Locality"
                    required
                  />
                </div>
                <div className="ck-field">
                  <label>City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="Bhubaneswar"
                    required
                  />
                </div>
                <div className="ck-field">
                  <label>PIN Code</label>
                  <input
                    name="zipCode"
                    value={form.zipCode}
                    onChange={onChange}
                    placeholder="751001"
                    required
                  />
                </div>
              </div>

              <div className="ck-nav">
                <span />
                <button
                  className="ck-btn-next"
                  onClick={handleNext}
                  disabled={
                    !form.name ||
                    !form.phone ||
                    !form.address ||
                    !form.city ||
                    !form.zipCode
                  }
                >
                  Continue to Payment
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Payment ── */}
          {step === 1 && (
            <div className="ck-section">
              <div className="ck-sec-hdr">
                <span className="ck-sec-icon">💳</span>
                <div>
                  <h2 className="ck-sec-title">Payment Method</h2>
                  <p className="ck-sec-sub">Choose how you'd like to pay.</p>
                </div>
              </div>

              {/* Payment toggles */}
              <div className="ck-pay-opts">
                <label
                  className={`ck-pay-opt ${
                    form.paymentMethod === "card" ? "ck-pay-opt--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === "card"}
                    onChange={onChange}
                  />
                  <div className="ck-pay-opt-icon">💳</div>
                  <div>
                    <p className="ck-pay-opt-title">Credit / Debit Card</p>
                    <p className="ck-pay-opt-sub">Visa, Mastercard, RuPay</p>
                  </div>
                  <div className="ck-pay-opt-radio" />
                </label>

                <label
                  className={`ck-pay-opt ${
                    form.paymentMethod === "upi" ? "ck-pay-opt--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={form.paymentMethod === "upi"}
                    onChange={onChange}
                  />
                  <div className="ck-pay-opt-icon">📱</div>
                  <div>
                    <p className="ck-pay-opt-title">UPI</p>
                    <p className="ck-pay-opt-sub">GPay, PhonePe, Paytm</p>
                  </div>
                  <div className="ck-pay-opt-radio" />
                </label>

                <label
                  className={`ck-pay-opt ${
                    form.paymentMethod === "cash" ? "ck-pay-opt--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={onChange}
                  />
                  <div className="ck-pay-opt-icon">💵</div>
                  <div>
                    <p className="ck-pay-opt-title">Cash on Delivery</p>
                    <p className="ck-pay-opt-sub">
                      Pay when your order arrives
                    </p>
                  </div>
                  <div className="ck-pay-opt-radio" />
                </label>
              </div>

              {/* Card fields */}
              {form.paymentMethod === "card" && (
                <div className="ck-card-form">
                  <div className="ck-card-header">
                    <p className="ck-card-header-title">Card Details</p>
                    <div className="ck-card-logos">
                      <span>VISA</span>
                      <span>MC</span>
                      <span>RuPay</span>
                    </div>
                  </div>
                  <div className="ck-fields">
                    <div className="ck-field ck-field--full">
                      <label>Card Number</label>
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={(e) =>
                          set(
                            "cardNumber",
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16)
                              .replace(/(.{4})/g, "$1 ")
                              .trim()
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="ck-field ck-field--full">
                      <label>Name on Card</label>
                      <input
                        name="cardName"
                        value={form.cardName}
                        onChange={onChange}
                        placeholder="ARJUN SHARMA"
                      />
                    </div>
                    <div className="ck-field">
                      <label>Expiry Date</label>
                      <input
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2)
                            v = v.slice(0, 2) + "/" + v.slice(2);
                          set("cardExpiry", v);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="ck-field">
                      <label>CVV</label>
                      <input
                        name="cardCvv"
                        value={form.cardCvv}
                        onChange={(e) =>
                          set(
                            "cardCvv",
                            e.target.value.replace(/\D/g, "").slice(0, 3)
                          )
                        }
                        placeholder="•••"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {form.paymentMethod === "upi" && (
                <div className="ck-card-form">
                  <div className="ck-fields">
                    <div className="ck-field ck-field--full">
                      <label>UPI ID</label>
                      <input name="upiId" placeholder="yourname@upi" />
                    </div>
                  </div>
                </div>
              )}

              {form.paymentMethod === "cash" && (
                <div className="ck-cash-note">
                  <span>💵</span>
                  <p>
                    Keep exact change of{" "}
                    <strong>₹{grandTotal.toFixed(2)}</strong> ready. Our rider
                    will collect at delivery.
                  </p>
                </div>
              )}

              <div className="ck-nav">
                <button className="ck-btn-back" onClick={handleBack}>
                  ← Back
                </button>
                <button className="ck-btn-next" onClick={handleNext}>
                  Review Order
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Review ── */}
          {step === 2 && (
            <div className="ck-section">
              <div className="ck-sec-hdr">
                <span className="ck-sec-icon">✅</span>
                <div>
                  <h2 className="ck-sec-title">Review & Place Order</h2>
                  <p className="ck-sec-sub">
                    Confirm your details before placing.
                  </p>
                </div>
              </div>

              <div className="ck-review-grid">
                {/* Delivery info */}
                <div className="ck-review-block">
                  <div className="ck-review-block-hdr">
                    <span>📍 Delivery Address</span>
                    <button onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p className="ck-review-val">{form.name}</p>
                  <p className="ck-review-val">{form.phone}</p>
                  <p className="ck-review-val">
                    {form.address}, {form.city} — {form.zipCode}
                  </p>
                </div>

                {/* Payment info */}
                <div className="ck-review-block">
                  <div className="ck-review-block-hdr">
                    <span>💳 Payment</span>
                    <button onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="ck-review-val">
                    {form.paymentMethod === "card" &&
                      `Card ending ••••${
                        form.cardNumber.replace(/\s/g, "").slice(-4) || "****"
                      }`}
                    {form.paymentMethod === "upi" && "UPI Payment"}
                    {form.paymentMethod === "cash" && "Cash on Delivery"}
                  </p>
                </div>
              </div>

              {/* Items review */}
              <div className="ck-review-items">
                <p className="ck-review-items-title">
                  Items ({cartItems.length})
                </p>
                {cartItems.map((item) => (
                  <div key={item.id} className="ck-review-item">
                    <div className="ck-review-item-img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>🍱</span>
                      )}
                    </div>
                    <div className="ck-review-item-info">
                      <p className="ck-review-item-name">{item.name}</p>
                      <p className="ck-review-item-cal">
                        🔥 {item.calories * item.quantity} kcal · ×
                        {item.quantity}
                      </p>
                    </div>
                    <span className="ck-review-item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ck-nav">
                <button className="ck-btn-back" onClick={handleBack}>
                  ← Back
                </button>
                <button
                  className="ck-btn-place"
                  onClick={handlePlace}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="ck-spinner" /> Placing…
                    </>
                  ) : (
                    <>Place Order · ₹{grandTotal.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT: Order Summary ═══ */}
        <div className="ck-sidebar">
          <div className="ck-summary-card">
            <h3 className="ck-summary-title">Order Summary</h3>

            <div className="ck-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="ck-summary-item">
                  <div className="ck-summary-item-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>🍱</span>
                    )}
                    <span className="ck-summary-item-qty">{item.quantity}</span>
                  </div>
                  <div className="ck-summary-item-info">
                    <p className="ck-summary-item-name">{item.name}</p>
                    <p className="ck-summary-item-cal">
                      🔥 {item.calories * item.quantity} kcal
                    </p>
                  </div>
                  <span className="ck-summary-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="ck-summary-fees">
              <div className="ck-fee-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="ck-fee-row">
                <span>Delivery</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="ck-fee-row">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="ck-summary-total">
              <span>Total</span>
              <span className="ck-summary-grand">₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="ck-summary-cal">
              <span>🔥 Total Calories</span>
              <span>{totalCalories} kcal</span>
            </div>
          </div>

          {/* ETA widget */}
          <div className="ck-eta-card">
            <div className="ck-eta-icon">🛵</div>
            <div>
              <p className="ck-eta-title">Estimated Delivery</p>
              <p className="ck-eta-time">25 – 35 mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
