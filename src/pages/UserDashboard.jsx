import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./UserDashboard.css";
import Navbar from "../components/Navbar";
// ─── Constants ───────────────────────────────────────────────────────────────
const formatINR = (n) => `₹${n}`;

const CALORIE_RANGES = [
  { max: 1400, label: "Very Low Calorie", color: "#6366f1" },
  { max: 1800, label: "Low Calorie", color: "#0ea5e9" },
  { max: 2200, label: "Moderate", color: "#10b981" },
  { max: 2800, label: "High Energy", color: "#f59e0b" },
  { max: 5000, label: "Athletic", color: "#ef4444" },
];

function getCalorieRangeInfo(cal) {
  return (
    CALORIE_RANGES.find((r) => cal <= r.max) ||
    CALORIE_RANGES[CALORIE_RANGES.length - 1]
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const FieldGroup = ({ label, error, children }) => (
  <div className="nd-field-group">
    <label className="nd-field-label">{label}</label>
    {children}
    {error && <span className="nd-field-error">{error}</span>}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const { totalCalories, getCartCount, addToCart } = useCart();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCalorieModal, setShowCalorieModal] = useState(false);

  // ── BMI Calculator State ──────────────────────────────────────────────────
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [bmiInput, setBmiInput] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
  });
  const [bmiInputErrors, setBmiInputErrors] = useState({});
  const [calculatedBmi, setCalculatedBmi] = useState(null);

  const [calorieProgress, setCalorieProgress] = useState(0);

  const [profileData, setProfileData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    activityLevel: "moderate",
    goal: "maintain",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [customCalories, setCustomCalories] = useState("");
  const [calorieLoading, setCalorieLoading] = useState(false);

  useEffect(() => {
    if (userProfile && !userProfile.profileCompleted) setShowProfileModal(true);
    else if (location.state?.showHealthProfileModal) setShowProfileModal(true);
  }, [userProfile, location]);

  useEffect(() => {
    if (userProfile?.dailyCalorieTarget) {
      const consumed = (userProfile.dailyCaloriesConsumed || 0) + totalCalories;
      const percentage = (consumed / userProfile.dailyCalorieTarget) * 100;
      setCalorieProgress(Math.min(percentage, 100));
    }
  }, [userProfile, totalCalories]);

  // ── BMI Calculator Helpers ────────────────────────────────────────────────
  const validateBmiInput = () => {
    const e = {};
    if (!bmiInput.age || bmiInput.age < 5 || bmiInput.age > 120)
      e.age = "Enter valid age (5–120)";
    if (!bmiInput.height || bmiInput.height < 50 || bmiInput.height > 250)
      e.height = "Height must be 50–250 cm";
    if (!bmiInput.weight || bmiInput.weight < 10 || bmiInput.weight > 400)
      e.weight = "Weight must be 10–400 kg";
    if (!bmiInput.gender) e.gender = "Please select gender";
    return e;
  };

  const handleCalculateBmi = (e) => {
    e.preventDefault();
    const errors = validateBmiInput();
    if (Object.keys(errors).length) {
      setBmiInputErrors(errors);
      return;
    }
    const h = parseFloat(bmiInput.height) / 100;
    const w = parseFloat(bmiInput.weight);
    const bmi = (w / (h * h)).toFixed(1);
    setCalculatedBmi(parseFloat(bmi));
  };

  const getBmiStatusFromValue = (bmi) => {
    if (isNaN(bmi) || bmi === null) return { text: "—", color: "#94a3b8" };
    if (bmi < 18.5) return { text: "Underweight", color: "#3b82f6" };
    if (bmi < 25) return { text: "Normal", color: "#10b981" };
    if (bmi < 30) return { text: "Overweight", color: "#f59e0b" };
    return { text: "Obese", color: "#ef4444" };
  };

  const handleBmiInputChange = (e) => {
    const { name, value } = e.target;
    setBmiInput((prev) => ({ ...prev, [name]: value }));
    if (bmiInputErrors[name])
      setBmiInputErrors((prev) => ({ ...prev, [name]: "" }));
    // Only clear the displayed result inside the modal preview — NOT the card value
    // The card value (calculatedBmi) is only cleared by explicit resetBmiCalculator()
  };

  // Close modal but KEEP calculatedBmi so it shows on the card
  const closeBmiModal = () => {
    setShowBmiModal(false);
    setBmiInputErrors({});
    // Do NOT reset calculatedBmi or bmiInput — card should keep showing result
  };

  // Called only when user explicitly wants to recalculate from scratch
  const resetBmiCalculator = () => {
    setBmiInput({ age: "", height: "", weight: "", gender: "" });
    setBmiInputErrors({});
    setCalculatedBmi(null);
  };

  // ── Profile / Calorie helpers ─────────────────────────────────────────────
  const calculateBMI = () => {
    if (userProfile?.height && userProfile?.weight) {
      const h = userProfile.height / 100;
      return (userProfile.weight / (h * h)).toFixed(1);
    }
    return "--";
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return { text: "Set Profile", color: "#94a3b8" };
    if (bmi < 18.5) return { text: "Underweight", color: "#3b82f6" };
    if (bmi < 25) return { text: "Normal", color: "#10b981" };
    if (bmi < 30) return { text: "Overweight", color: "#f59e0b" };
    return { text: "Obese", color: "#ef4444" };
  };

  const calculateCalories = (data) => {
    if (!data.age || !data.height || !data.weight || !data.gender) return 2000;
    const age = parseInt(data.age);
    const h = parseFloat(data.height);
    const w = parseFloat(data.weight);
    let bmr =
      data.gender === "male"
        ? 10 * w + 6.25 * h - 5 * age + 5
        : 10 * w + 6.25 * h - 5 * age - 161;
    const mult = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    let tdee = bmr * (mult[data.activityLevel] || 1.55);
    if (data.goal === "lose") tdee -= 500;
    if (data.goal === "gain") tdee += 500;
    return Math.round(tdee);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name])
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateProfile = () => {
    const e = {};
    if (!profileData.age || profileData.age < 13 || profileData.age > 120)
      e.age = "Enter a valid age (13–120)";
    if (
      !profileData.height ||
      profileData.height < 100 ||
      profileData.height > 250
    )
      e.height = "Height must be 100–250 cm";
    if (
      !profileData.weight ||
      profileData.weight < 30 ||
      profileData.weight > 300
    )
      e.weight = "Weight must be 30–300 kg";
    if (!profileData.gender) e.gender = "Please select gender";
    return e;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length) {
      setProfileErrors(errors);
      return;
    }
    setProfileLoading(true);
    try {
      const cal = calculateCalories(profileData);
      await updateUserProfile(currentUser.uid, {
        age: parseInt(profileData.age),
        height: parseFloat(profileData.height),
        weight: parseFloat(profileData.weight),
        gender: profileData.gender,
        activityLevel: profileData.activityLevel,
        goal: profileData.goal,
        dailyCalorieTarget: cal,
        profileCompleted: true,
      });
      setShowProfileModal(false);
      setProfileData({
        age: "",
        height: "",
        weight: "",
        gender: "",
        activityLevel: "moderate",
        goal: "maintain",
      });
    } catch {
      setProfileErrors({ general: "Failed to save. Try again." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateCalories = async (e) => {
    e.preventDefault();
    if (!customCalories || customCalories < 1200 || customCalories > 5000)
      return alert("Enter a value between 1200–5000");
    setCalorieLoading(true);
    try {
      await updateUserProfile(currentUser.uid, {
        dailyCalorieTarget: parseInt(customCalories),
      });
      setShowCalorieModal(false);
      setCustomCalories("");
    } catch {
      alert("Failed. Try again.");
    } finally {
      setCalorieLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {}
  };

  if (!userProfile) {
    return (
      <div className="nd-load-wrap">
        <div className="nd-spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  const target = userProfile?.dailyCalorieTarget || 2000;
  const consumed = (userProfile.dailyCaloriesConsumed || 0) + totalCalories;
  const remaining = target - consumed;
  const overLimit = consumed > target;
  const bmiStatus = getBMIStatus();
  const rangeInfo = getCalorieRangeInfo(target);
  const progColor = overLimit
    ? "#ef4444"
    : calorieProgress > 80
    ? "#f59e0b"
    : "#10b981";

  const bmiDisplayValue =
    calculatedBmi !== null ? calculatedBmi : calculateBMI();
  const bmiDisplayStatus =
    calculatedBmi !== null ? getBmiStatusFromValue(calculatedBmi) : bmiStatus;

  return (
    <div className="nd-root">
      {/* ── BMI Calculator Modal ──────────────────────────────────────── */}
      {showBmiModal && (
        <div
          className="nd-overlay"
          onClick={() => {
            if (!calculatedBmi) closeBmiModal();
          }}
        >
          <div
            className="nd-modal-box small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nd-modal-head">
              <div className="nd-modal-emoji">📊</div>
              <h2 className="nd-modal-title">BMI Calculator</h2>
              <p className="nd-modal-sub">
                Enter your details to calculate your Body Mass Index
              </p>
            </div>
            <form onSubmit={handleCalculateBmi}>
              <div className="nd-form-row">
                <FieldGroup label="Age" error={bmiInputErrors.age}>
                  <input
                    type="number"
                    name="age"
                    value={bmiInput.age}
                    onChange={handleBmiInputChange}
                    placeholder="25"
                    className={`nd-field-input${
                      bmiInputErrors.age ? " error" : ""
                    }`}
                  />
                </FieldGroup>
                <FieldGroup label="Gender" error={bmiInputErrors.gender}>
                  <select
                    name="gender"
                    value={bmiInput.gender}
                    onChange={handleBmiInputChange}
                    className={`nd-field-input${
                      bmiInputErrors.gender ? " error" : ""
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FieldGroup>
              </div>
              <div className="nd-form-row">
                <FieldGroup label="Height (cm)" error={bmiInputErrors.height}>
                  <input
                    type="number"
                    name="height"
                    value={bmiInput.height}
                    onChange={handleBmiInputChange}
                    placeholder="170"
                    className={`nd-field-input${
                      bmiInputErrors.height ? " error" : ""
                    }`}
                  />
                </FieldGroup>
                <FieldGroup label="Weight (kg)" error={bmiInputErrors.weight}>
                  <input
                    type="number"
                    name="weight"
                    value={bmiInput.weight}
                    onChange={handleBmiInputChange}
                    placeholder="70"
                    className={`nd-field-input${
                      bmiInputErrors.weight ? " error" : ""
                    }`}
                  />
                </FieldGroup>
              </div>

              {calculatedBmi !== null && (
                <div
                  className="nd-cal-preview"
                  style={{
                    borderColor:
                      getBmiStatusFromValue(calculatedBmi).color + "60",
                  }}
                >
                  <span className="nd-cal-preview-label">Your BMI</span>
                  <span
                    className="nd-cal-preview-val"
                    style={{
                      color: getBmiStatusFromValue(calculatedBmi).color,
                    }}
                  >
                    {calculatedBmi}
                  </span>
                  <span
                    className="nd-cal-preview-note"
                    style={{
                      background:
                        getBmiStatusFromValue(calculatedBmi).color + "20",
                      color: getBmiStatusFromValue(calculatedBmi).color,
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    {getBmiStatusFromValue(calculatedBmi).text}
                  </span>
                </div>
              )}

              {/* BMI scale reference */}
              <div
                style={{
                  margin: "12px 0",
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                <div
                  style={{ fontWeight: 600, marginBottom: 6, color: "#64748b" }}
                >
                  BMI Scale
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { range: "< 18.5", label: "Underweight", color: "#3b82f6" },
                    { range: "18.5–24.9", label: "Normal", color: "#10b981" },
                    { range: "25–29.9", label: "Overweight", color: "#f59e0b" },
                    { range: "≥ 30", label: "Obese", color: "#ef4444" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: s.color,
                        }}
                      />
                      <span style={{ color: "#64748b" }}>
                        {s.range}{" "}
                        <strong style={{ color: s.color }}>{s.label}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nd-modal-footer">
                {calculatedBmi !== null ? (
                  <>
                    <button
                      type="button"
                      className="nd-btn-secondary"
                      onClick={resetBmiCalculator}
                    >
                      🔄 Recalculate
                    </button>
                    <button
                      type="button"
                      className="nd-btn-primary"
                      onClick={closeBmiModal}
                    >
                      ✓ Done — Show on Card
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="nd-btn-secondary"
                      onClick={closeBmiModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="nd-btn-primary">
                      Calculate BMI
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Profile Modal ──────────────────────────────────────────────── */}
      {showProfileModal && (
        <div
          className="nd-overlay"
          onClick={() =>
            userProfile.profileCompleted && setShowProfileModal(false)
          }
        >
          <div className="nd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="nd-modal-head">
              <div className="nd-modal-emoji">🧬</div>
              <h2 className="nd-modal-title">Health Profile</h2>
              <p className="nd-modal-sub">
                Personalise your calorie targets &amp; meal suggestions
              </p>
            </div>
            <form onSubmit={handleSaveProfile}>
              {profileErrors.general && (
                <div className="nd-err-banner">{profileErrors.general}</div>
              )}
              <div className="nd-form-row">
                <FieldGroup label="Age" error={profileErrors.age}>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleProfileChange}
                    placeholder="25"
                    className={`nd-field-input${
                      profileErrors.age ? " error" : ""
                    }`}
                  />
                </FieldGroup>
                <FieldGroup label="Gender" error={profileErrors.gender}>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleProfileChange}
                    className={`nd-field-input${
                      profileErrors.gender ? " error" : ""
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FieldGroup>
              </div>
              <div className="nd-form-row">
                <FieldGroup label="Height (cm)" error={profileErrors.height}>
                  <input
                    type="number"
                    name="height"
                    value={profileData.height}
                    onChange={handleProfileChange}
                    placeholder="170"
                    className={`nd-field-input${
                      profileErrors.height ? " error" : ""
                    }`}
                  />
                </FieldGroup>
                <FieldGroup label="Weight (kg)" error={profileErrors.weight}>
                  <input
                    type="number"
                    name="weight"
                    value={profileData.weight}
                    onChange={handleProfileChange}
                    placeholder="70"
                    className={`nd-field-input${
                      profileErrors.weight ? " error" : ""
                    }`}
                  />
                </FieldGroup>
              </div>
              <FieldGroup label="Activity Level">
                <select
                  name="activityLevel"
                  value={profileData.activityLevel}
                  onChange={handleProfileChange}
                  className="nd-field-input"
                >
                  <option value="sedentary">
                    Sedentary (little/no exercise)
                  </option>
                  <option value="light">Light (1–3 days/week)</option>
                  <option value="moderate">Moderate (3–5 days/week)</option>
                  <option value="active">Active (6–7 days/week)</option>
                  <option value="veryActive">
                    Very Active (intense daily)
                  </option>
                </select>
              </FieldGroup>
              <FieldGroup label="Your Goal">
                <div className="nd-goal-row">
                  {[
                    ["lose", "📉 Lose Weight"],
                    ["maintain", "➡️ Maintain"],
                    ["gain", "📈 Gain Weight"],
                  ].map(([v, l]) => (
                    <label
                      key={v}
                      className={`nd-goal-opt${
                        profileData.goal === v ? " active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={v}
                        checked={profileData.goal === v}
                        onChange={handleProfileChange}
                        style={{ display: "none" }}
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </FieldGroup>
              {profileData.age &&
                profileData.height &&
                profileData.weight &&
                profileData.gender && (
                  <div className="nd-cal-preview">
                    <span className="nd-cal-preview-label">
                      Recommended daily calories
                    </span>
                    <span className="nd-cal-preview-val">
                      {calculateCalories(profileData)}
                    </span>
                    <span className="nd-cal-preview-note">kcal / day</span>
                  </div>
                )}
              <div className="nd-modal-footer">
                {userProfile.profileCompleted && (
                  <button
                    type="button"
                    className="nd-btn-secondary"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="nd-btn-primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Custom Calorie Modal ──────────────────────────────────────── */}
      {showCalorieModal && (
        <div className="nd-overlay" onClick={() => setShowCalorieModal(false)}>
          <div
            className="nd-modal-box small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nd-modal-head">
              <div className="nd-modal-emoji">🎯</div>
              <h2 className="nd-modal-title">Custom Calorie Target</h2>
              <p className="nd-modal-sub">
                Override the auto-calculated target
              </p>
            </div>
            <form onSubmit={handleUpdateCalories}>
              <FieldGroup label={`Daily Calorie Target (current: ${target})`}>
                <input
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  placeholder={target}
                  min="1200"
                  max="5000"
                  className="nd-field-input"
                />
              </FieldGroup>
              <p className="nd-field-hint">Recommended range: 1200–5000 kcal</p>
              <div className="nd-modal-footer">
                <button
                  type="button"
                  className="nd-btn-secondary"
                  onClick={() => setShowCalorieModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="nd-btn-primary"
                  disabled={calorieLoading}
                >
                  {calorieLoading ? "Updating…" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Navbar
        getCartCount={getCartCount}
        userProfile={userProfile}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowProfileModal={setShowProfileModal}
      />
      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="nd-main">
        {/* Welcome */}
        <div className="nd-welcome-row">
          <div>
            <h1 className="nd-welcome-title">
              Good {getTimeOfDay()}, {userProfile.name?.split(" ")[0]} 👋
            </h1>
            <p className="nd-welcome-sub">
              {userProfile.profileCompleted
                ? "Here's your personalised nutrition overview"
                : "Complete your health profile for personalised recommendations"}
            </p>
          </div>
          <div className="nd-welcome-right">
            <div
              className="nd-cal-pill"
              style={{
                background: rangeInfo.color + "20",
                borderColor: rangeInfo.color + "60",
                color: rangeInfo.color,
              }}
            >
              <span
                className="nd-cal-pill-dot"
                style={{ background: rangeInfo.color }}
              />
              {rangeInfo.label}
            </div>
          </div>
        </div>

        {/* Incomplete Profile Banner */}
        {!userProfile.profileCompleted && (
          <div className="nd-banner">
            <span className="nd-banner-icon">⚠️</span>
            <div className="nd-banner-content">
              <strong className="nd-banner-title">
                Complete your health profile
              </strong>
              <p className="nd-banner-text">
                Set up your profile to get accurate calorie tracking &amp;
                personalised meals.
              </p>
            </div>
            <button
              className="nd-banner-btn"
              onClick={() => setShowProfileModal(true)}
            >
              Complete Now
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="nd-stats-grid">
          {/* Calorie Tracker */}
          <div className="nd-stat-card span-2">
            <div className="nd-stat-card-head">
              <span className="nd-stat-card-title">Today's Calories</span>
              <button
                className="nd-icon-btn"
                onClick={() => setShowCalorieModal(true)}
                title="Customise"
              >
                ✏️
              </button>
            </div>
            <div className="nd-cal-display">
              <span className={`nd-cal-big${overLimit ? " over" : ""}`}>
                {consumed}
              </span>
              <span className="nd-cal-slash">/</span>
              <span className="nd-cal-target">{target}</span>
              <span className="nd-cal-unit">kcal</span>
            </div>
            <div className="nd-progress-track">
              <div
                className="nd-progress-fill"
                style={{ width: `${calorieProgress}%`, background: progColor }}
              />
            </div>
            <div className="nd-cal-footer">
              {remaining > 0 ? (
                <span className="nd-remain-ok">
                  ✓ {remaining} kcal remaining today
                </span>
              ) : (
                <span className="nd-remain-over">
                  ⚠ {Math.abs(remaining)} kcal over limit
                </span>
              )}
              <span className="nd-cal-pct">
                {Math.round(calorieProgress)}% of goal
              </span>
            </div>
          </div>

          {/* BMI — clickable to open calculator */}
          <div
            className="nd-stat-card"
            onClick={() => setShowBmiModal(true)}
            title="Click to calculate your BMI"
            style={{
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Hint badge — sits inside the card head row, not absolute */}
            <div className="nd-stat-card-head">
              <span className="nd-stat-card-title">BMI Index</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    background:
                      calculatedBmi !== null ? "#10b98120" : "#6366f120",
                    color: calculatedBmi !== null ? "#10b981" : "#6366f1",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 20,
                    border: `1px solid ${
                      calculatedBmi !== null ? "#10b98130" : "#6366f130"
                    }`,
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {calculatedBmi !== null ? "✓ CUSTOM" : "CALCULATE"}
                </span>
                <span>📊</span>
              </div>
            </div>
            <div
              className="nd-stat-big"
              style={{ color: bmiDisplayStatus.color }}
            >
              {bmiDisplayValue}
            </div>
            <div
              className="nd-stat-badge"
              style={{
                background: bmiDisplayStatus.color + "20",
                color: bmiDisplayStatus.color,
              }}
            >
              {bmiDisplayStatus.text}
            </div>
            <div className="nd-stat-detail">
              {calculatedBmi !== null
                ? `Custom calc: ${bmiInput.height}cm · ${bmiInput.weight}kg`
                : userProfile.height
                ? `${userProfile.height}cm · ${userProfile.weight}kg`
                : "Click to calculate"}
            </div>
          </div>

          {/* Goal */}
          <div className="nd-stat-card">
            <div className="nd-stat-card-head">
              <span className="nd-stat-card-title">Active Goal</span>
              <span>🎯</span>
            </div>
            <div className="nd-stat-big" style={{ fontSize: 22 }}>
              {userProfile.goal === "lose" && "📉"}
              {userProfile.goal === "maintain" && "➡️"}
              {userProfile.goal === "gain" && "📈"}
              {!userProfile.goal && "—"}
            </div>
            <div className="nd-stat-badge">
              {userProfile.goal === "lose"
                ? "Lose Weight"
                : userProfile.goal === "gain"
                ? "Gain Weight"
                : "Maintain"}
            </div>
            <div className="nd-stat-detail">
              {userProfile.activityLevel || "—"} activity
            </div>
          </div>

          {/* Macros */}
          <div className="nd-stat-card span-2">
            <div className="nd-stat-card-head">
              <span className="nd-stat-card-title">Nutrition Targets</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Based on {target} kcal
              </span>
            </div>
            <div className="nd-macro-row">
              {[
                {
                  label: "Protein",
                  val: Math.round((target * 0.25) / 4) + "g",
                  color: "#6366f1",
                  pct: "25%",
                },
                {
                  label: "Carbs",
                  val: Math.round((target * 0.5) / 4) + "g",
                  color: "#f59e0b",
                  pct: "50%",
                },
                {
                  label: "Fat",
                  val: Math.round((target * 0.25) / 9) + "g",
                  color: "#10b981",
                  pct: "25%",
                },
              ].map((m) => (
                <div key={m.label} className="nd-macro-item">
                  <div
                    className="nd-macro-dot"
                    style={{ background: m.color }}
                  />
                  <div className="nd-macro-label">{m.label}</div>
                  <div className="nd-macro-val" style={{ color: m.color }}>
                    {m.val}
                  </div>
                  <div className="nd-macro-pct">{m.pct} of diet</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Browse Menu CTA */}
        <div className="nd-menu-cta">
          <div className="nd-menu-cta-content">
            <div className="nd-menu-cta-icon">🍽️</div>
            <div>
              <h3 className="nd-menu-cta-title">Ready to order?</h3>
              <p className="nd-menu-cta-sub">
                Browse our curated menu — meals are filtered to your {target}{" "}
                kcal target. Calories added to cart update your tracker
                automatically.
              </p>
            </div>
          </div>
          <Link to="/menu" className="nd-btn-primary nd-menu-cta-btn">
            Browse Menu →
          </Link>
        </div>

        {/* Health Tips */}
        <div className="nd-tips-section">
          <h2 className="nd-section-title">Daily Health Tips</h2>
          <div className="nd-tips-grid">
            {[
              {
                icon: "💧",
                title: "Stay Hydrated",
                body: "Drink 8+ glasses of water daily. Hydration improves metabolism and reduces false hunger signals.",
              },
              {
                icon: "🥗",
                title: "Balanced Macros",
                body: "Aim for 25% protein, 50% carbs, 25% healthy fats to fuel your day optimally.",
              },
              {
                icon: "🏃",
                title: "Move Daily",
                body: "Even 20 minutes of moderate exercise compounds your nutritional efforts significantly.",
              },
              {
                icon: "😴",
                title: "Sleep to Recover",
                body: "7–9 hours of sleep optimises hormone levels that govern hunger and metabolism.",
              },
            ].map((t) => (
              <div key={t.title} className="nd-tip-card">
                <div className="nd-tip-icon">{t.icon}</div>
                <div>
                  <h3 className="nd-tip-title">{t.title}</h3>
                  <p className="nd-tip-body">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
