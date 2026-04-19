import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || "",
    age: userProfile.age || "",
    height: userProfile.height || "",
    weight: userProfile.weight || "",
    gender: userProfile.gender || "",
    activityLevel: userProfile.activityLevel || "moderate",
    goal: userProfile.goal || "maintain",
  });

  const calculateCalories = (data) => {
    if (!data.age || !data.height || !data.weight || !data.gender) return 2000;
    const age = parseInt(data.age);
    const height = parseFloat(data.height);
    const weight = parseFloat(data.weight);
    let bmr;
    if (data.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    let tdee = bmr * activityMultipliers[data.activityLevel];
    if (data.goal === "lose") tdee -= 500;
    else if (data.goal === "gain") tdee += 500;
    return Math.round(tdee);
  };

  const getBMI = () => {
    if (!userProfile.height || !userProfile.weight) return null;
    return (userProfile.weight / (userProfile.height / 100) ** 2).toFixed(1);
  };

  const getBMILabel = (bmi) => {
    if (!bmi) return { label: "—", color: "#94a3b8" };
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: "Underweight", color: "#f59e0b" };
    if (val < 25) return { label: "Healthy", color: "#10b981" };
    if (val < 30) return { label: "Overweight", color: "#f97316" };
    return { label: "Obese", color: "#ef4444" };
  };

  const getGoalLabel = (goal) => {
    const map = {
      lose: "Lose Weight",
      maintain: "Maintain",
      gain: "Gain Weight",
    };
    return map[goal] || goal;
  };

  const getActivityLabel = (level) => {
    const map = {
      sedentary: "Sedentary",
      light: "Light",
      moderate: "Moderate",
      active: "Active",
      veryActive: "Very Active",
    };
    return map[level] || level;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const calculatedCalories = calculateCalories(formData);
    await updateUserProfile(currentUser.uid, {
      ...formData,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      dailyCalorieTarget: calculatedCalories,
      profileCompleted: true,
    });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const bmi = getBMI();
  const bmiInfo = getBMILabel(bmi);
  const initials = (userProfile.name || currentUser?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      {/* Background decoration */}
      <div className="profile-bg-orb orb-1" />
      <div className="profile-bg-orb orb-2" />

      <div className="profile-wrapper">
        {/* Hero Header */}
        <div className="profile-hero">
          <div className="avatar-ring">
            <div className="avatar">{initials}</div>
          </div>
          <div className="hero-text">
            <h1 className="hero-name">{userProfile.name || "Your Profile"}</h1>
            <p className="hero-email">{currentUser?.email}</p>
            <div className="hero-badges">
              <span className="badge badge-goal">
                {getGoalLabel(userProfile.goal)}
              </span>
              <span className="badge badge-activity">
                {getActivityLabel(userProfile.activityLevel)}
              </span>
            </div>
          </div>
          <button
            className={`edit-toggle-btn ${isEditing ? "editing" : ""}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <span className="btn-icon">✕</span> Cancel
              </>
            ) : (
              <>
                <span className="btn-icon">✎</span> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-strip">
          <div className="stat-pill">
            <span className="stat-pill-icon">🔥</span>
            <div>
              <div className="stat-pill-value">
                {userProfile.dailyCalorieTarget || "—"}
              </div>
              <div className="stat-pill-label">kcal / day</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-pill-icon">⚖️</span>
            <div>
              <div className="stat-pill-value" style={{ color: bmiInfo.color }}>
                {bmi || "—"}
              </div>
              <div className="stat-pill-label">BMI · {bmiInfo.label}</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-pill-icon">📏</span>
            <div>
              <div className="stat-pill-value">
                {userProfile.height ? `${userProfile.height}` : "—"}
              </div>
              <div className="stat-pill-label">Height (cm)</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-pill-icon">🏋️</span>
            <div>
              <div className="stat-pill-value">
                {userProfile.weight ? `${userProfile.weight}` : "—"}
              </div>
              <div className="stat-pill-label">Weight (kg)</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-grid">
          {/* Left: Info or Form */}
          <div className="profile-card main-card">
            {isEditing ? (
              <>
                <div className="card-label">Editing Profile</div>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label>Full Name </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="yrs"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="cm"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="kg"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Activity Level</label>
                    <div className="option-pills">
                      {[
                        "sedentary",
                        "light",
                        "moderate",
                        "active",
                        "veryActive",
                      ].map((lvl) => (
                        <label
                          key={lvl}
                          className={`option-pill ${
                            formData.activityLevel === lvl ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="activityLevel"
                            value={lvl}
                            checked={formData.activityLevel === lvl}
                            onChange={handleChange}
                          />
                          {getActivityLabel(lvl)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Goal</label>
                    <div className="goal-cards">
                      {[
                        { value: "lose", icon: "📉", label: "Lose Weight" },
                        { value: "maintain", icon: "⚖️", label: "Maintain" },
                        { value: "gain", icon: "📈", label: "Gain Weight" },
                      ].map((g) => (
                        <label
                          key={g.value}
                          className={`goal-card ${
                            formData.goal === g.value ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="goal"
                            value={g.value}
                            checked={formData.goal === g.value}
                            onChange={handleChange}
                          />
                          <span className="goal-card-icon">{g.icon}</span>
                          <span className="goal-card-label">{g.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="card-label">Personal Information</div>
                <div className="info-list">
                  {[
                    { label: "Name", value: userProfile.name },
                    { label: "Email", value: currentUser?.email },
                    {
                      label: "Age",
                      value: userProfile.age ? `${userProfile.age} yrs` : null,
                    },
                    { label: "Gender", value: userProfile.gender },
                    {
                      label: "Height",
                      value: userProfile.height
                        ? `${userProfile.height} cm`
                        : null,
                    },
                    {
                      label: "Weight",
                      value: userProfile.weight
                        ? `${userProfile.weight} kg`
                        : null,
                    },
                    {
                      label: "Activity",
                      value: getActivityLabel(userProfile.activityLevel),
                    },
                    { label: "Goal", value: getGoalLabel(userProfile.goal) },
                  ].map(({ label, value }) => (
                    <div className="info-row" key={label}>
                      <span className="info-key">{label}</span>
                      <span className="info-val">
                        {value || <em>Not set</em>}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Calorie + BMI visual */}
          <div className="right-col">
            <div className="profile-card calorie-card">
              <div className="card-label">Daily Target</div>
              <div className="calorie-ring-wrap">
                <svg className="calorie-ring" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#cGrad)"
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeDashoffset="80"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient
                      id="cGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="calorie-center">
                  <div className="calorie-number">
                    {userProfile.dailyCalorieTarget || "—"}
                  </div>
                  <div className="calorie-unit">kcal</div>
                </div>
              </div>
              <p className="calorie-note">Based on your stats &amp; goal</p>
            </div>

            <div className="profile-card bmi-card">
              <div className="card-label">BMI Index</div>
              <div className="bmi-display">
                <span className="bmi-value" style={{ color: bmiInfo.color }}>
                  {bmi || "—"}
                </span>
                <span
                  className="bmi-tag"
                  style={{
                    background: bmiInfo.color + "22",
                    color: bmiInfo.color,
                  }}
                >
                  {bmiInfo.label}
                </span>
              </div>
              <div className="bmi-scale">
                <div className="bmi-scale-track">
                  <div
                    className="bmi-scale-fill"
                    style={{
                      width: bmi
                        ? `${Math.min(
                            ((parseFloat(bmi) - 10) / 30) * 100,
                            100
                          )}%`
                        : "0%",
                      background: bmiInfo.color,
                    }}
                  />
                </div>
                <div className="bmi-scale-labels">
                  <span>10</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
