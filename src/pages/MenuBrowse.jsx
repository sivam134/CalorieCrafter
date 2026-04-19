import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./MenuBrowse.css";
import Navbar from "../components/Navbar";
const FOOD_DATABASE = [
  // ── Rice & Grains ──────────────────────────────────────────────────────────
  {
    id: "r1",
    name: "Steamed White Rice",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 260,
    protein: 5.4,
    carbs: 56.4,
    fat: 0.6,
    fiber: 0.8,
    badge: "Staple",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
    description: "Fluffy steamed white rice, perfectly cooked",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "r2",
    name: "Basmati Rice",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 260,
    protein: 8.0,
    carbs: 56.0,
    fat: 0.0,
    fiber: 0.0,
    badge: "Aromatic",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80",
    description: "Long grain fragrant basmati, light & fluffy",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "r3",
    name: "Jeera Rice",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 320,
    protein: 4.2,
    carbs: 48.0,
    fat: 12.0,
    fiber: 0.0,
    badge: "Spiced",
    price: 79,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrxHf4M8SQ8rPNeP1Tv4452f0rnhOUhva1gg&s",
    description: "Cumin tempered rice, aromatic & buttery",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "r4",
    name: "Ghee Rice",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 300,
    protein: 5.6,
    carbs: 47.0,
    fat: 10.2,
    fiber: 0.0,
    badge: "Rich",
    price: 89,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGjDJpg08-j4KYFTVAcK6nUNqYquY1u60sw&s",
    description: "Rice tossed in pure ghee, golden & fragrant",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "r5",
    name: "Tomato Rice",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 230,
    protein: 4.0,
    carbs: 37.2,
    fat: 7.6,
    fiber: 2.0,
    badge: "Tangy",
    price: 79,
    image:
      "https://www.whiskaffair.com/wp-content/uploads/2020/06/Rasam-2-1.jpg",
    description: "Rice cooked with ripe tomatoes & south Indian spices",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "r6",
    name: "Peas Pulao",
    category: "Rice & Grains",
    categoryIcon: "🍚",
    serving: "200g",
    calories: 368,
    protein: 8.0,
    carbs: 60.0,
    fat: 11.2,
    fiber: 6.0,
    badge: "High Fiber",
    price: 99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrxHf4M8SQ8rPNeP1Tv4452f0rnhOUhva1gg&s",
    description: "Fragrant pulao with green peas & whole spices",
    isVegetarian: true,
    isSweet: false,
  },
  // ── Proteins ──────────────────────────────────────────────────────────────
  {
    id: "p1",
    name: "Grilled Chicken Drumstick",
    category: "Proteins",
    categoryIcon: "🍗",
    serving: "150g",
    calories: 300,
    protein: 37.5,
    carbs: 0.0,
    fat: 15.0,
    fiber: 0.0,
    badge: "Lean Protein",
    price: 199,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgl5OWBDfoZphATbh9kQhl51vG3aTt675s7w&s",
    description: "Air-fried chicken drumstick, juicy & lightly seasoned",
    isVegetarian: false,
    isSweet: false,
  },
  {
    id: "p2",
    name: "Grilled Fish Steak",
    category: "Proteins",
    categoryIcon: "🐟",
    serving: "150g",
    calories: 233,
    protein: 33.0,
    carbs: 0.0,
    fat: 10.1,
    fiber: 0.0,
    badge: "Omega-3 Rich",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
    description: "Lightly marinated fish steak, grilled to perfection",
    isVegetarian: false,
    isSweet: false,
  },
  {
    id: "p3",
    name: "Grilled Paneer Steak",
    category: "Proteins",
    categoryIcon: "🧀",
    serving: "150g",
    calories: 398,
    protein: 27.0,
    carbs: 3.0,
    fat: 30.0,
    fiber: 0.0,
    badge: "Vegetarian",
    price: 179,
    image:
      "https://thumbs.dreamstime.com/b/grilled-paneer-tikka-smoky-kitchen-indian-food-365388443.jpg",
    description: "Thick paneer slab grilled with herbs & spices",
    isVegetarian: true,
    isSweet: false,
  },
  // ── Curries & Lentils ─────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Dal (Lentil Curry)",
    category: "Curries & Lentils",
    categoryIcon: "🍲",
    serving: "250ml",
    calories: 290,
    protein: 18.0,
    carbs: 52.0,
    fat: 1.0,
    fiber: 18.3,
    badge: "High Fiber",
    price: 89,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kLMn_YJz4DEPNat_gUTF_QWOxqKiIRWMQw&s",
    description: "Classic yellow dal tempered with cumin & ghee",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "c2",
    name: "Sambar",
    category: "Curries & Lentils",
    categoryIcon: "🍲",
    serving: "250ml",
    calories: 200,
    protein: 7.5,
    carbs: 27.5,
    fat: 2.5,
    fiber: 7.5,
    badge: "Probiotic",
    price: 69,
    image:
      "https://www.whiskaffair.com/wp-content/uploads/2020/06/Rasam-2-1.jpg",
    description: "Tamarind lentil stew with drumstick & tomato",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "c3",
    name: "Rasam",
    category: "Curries & Lentils",
    categoryIcon: "🍲",
    serving: "200ml",
    calories: 38,
    protein: 1.9,
    carbs: 13.8,
    fat: 4.4,
    fiber: 2.0,
    badge: "Low Cal",
    price: 49,
    image:
      "https://www.whiskaffair.com/wp-content/uploads/2020/06/Rasam-2-1.jpg",
    description: "Peppery tamarind broth, great for digestion",
    isVegetarian: true,
    isSweet: false,
  },
  // ── Salads ────────────────────────────────────────────────────────────────
  {
    id: "s1",
    name: "Cucumber Salad",
    category: "Salads",
    categoryIcon: "🥗",
    serving: "150g",
    calories: 18,
    protein: 0.9,
    carbs: 3.3,
    fat: 0.2,
    fiber: 1.1,
    badge: "Super Low Cal",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    description: "Crisp cucumber with lemon & chaat masala",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "s2",
    name: "Cucumber & Onion Salad",
    category: "Salads",
    categoryIcon: "🥗",
    serving: "150g",
    calories: 63,
    protein: 1.4,
    carbs: 15.2,
    fat: 0.1,
    fiber: 2.1,
    badge: "Fresh",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    description: "Sliced cucumber & onion with vinegar dressing",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "s3",
    name: "Cucumber Onion Tomato Salad",
    category: "Salads",
    categoryIcon: "🥗",
    serving: "150g",
    calories: 27,
    protein: 1.3,
    carbs: 5.9,
    fat: 0.3,
    fiber: 1.8,
    badge: "Antioxidant",
    price: 69,
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
    description: "Three-veg salad with coriander & lemon",
    isVegetarian: true,
    isSweet: false,
  },
  // ── Dairy & Sides ─────────────────────────────────────────────────────────
  {
    id: "d1",
    name: "Yogurt (Curd)",
    category: "Dairy & Sides",
    categoryIcon: "🥛",
    serving: "150ml",
    calories: 95,
    protein: 7.8,
    carbs: 10.5,
    fat: 2.3,
    fiber: 0.0,
    badge: "Probiotic",
    price: 39,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFSFjIhL0U1gpUA-aTMeQ-vFIux2KPukTlkA&s",
    description: "Fresh home-style curd, cool & creamy",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "d2",
    name: "Hung Curd",
    category: "Dairy & Sides",
    categoryIcon: "🥛",
    serving: "100ml",
    calories: 77,
    protein: 7.5,
    carbs: 4.5,
    fat: 3.1,
    fiber: 0.0,
    badge: "High Protein",
    price: 49,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFSFjIhL0U1gpUA-aTMeQ-vFIux2KPukTlkA&s",
    description: "Thick strained curd, perfect as dip or raita base",
    isVegetarian: true,
    isSweet: false,
  },
  {
    id: "d3",
    name: "Pure Ghee (1 tbsp)",
    category: "Dairy & Sides",
    categoryIcon: "🧈",
    serving: "15ml",
    calories: 135,
    protein: 0.0,
    carbs: 0.0,
    fat: 15.0,
    fiber: 0.0,
    badge: "Rich",
    price: 29,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGjDJpg08-j4KYFTVAcK6nUNqYquY1u60sw&s",
    description: "Clarified butter — rich in fat-soluble vitamins",
    isVegetarian: true,
    isSweet: false,
  },
  // ── Sweets ────────────────────────────────────────────────────────────────
  {
    id: "sw1",
    name: "Gulab Jamun",
    category: "Sweets",
    categoryIcon: "🍮",
    serving: "2 pieces (80g)",
    calories: 285,
    protein: 4.2,
    carbs: 52.0,
    fat: 7.8,
    fiber: 0.3,
    badge: "Classic",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1666189764040-3ead553f1a0c?w=400&q=80",
    description: "Soft milk-solid dumplings soaked in rose sugar syrup",
    isVegetarian: true,
    isSweet: true,
  },
  {
    id: "sw2",
    name: "Rasgulla",
    category: "Sweets",
    categoryIcon: "🍮",
    serving: "2 pieces (80g)",
    calories: 186,
    protein: 5.0,
    carbs: 38.0,
    fat: 2.4,
    fiber: 0.0,
    badge: "Light Sweet",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1655203842659-4eabf9f04bbc?w=400&q=80",
    description: "Spongy chenna balls in light sugar syrup",
    isVegetarian: true,
    isSweet: true,
  },
  {
    id: "sw3",
    name: "Kheer (Rice Pudding)",
    category: "Sweets",
    categoryIcon: "🍮",
    serving: "150ml",
    calories: 220,
    protein: 5.5,
    carbs: 38.0,
    fat: 5.8,
    fiber: 0.2,
    badge: "Festive",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
    description: "Creamy rice pudding with cardamom & nuts",
    isVegetarian: true,
    isSweet: true,
  },
  {
    id: "sw4",
    name: "Halwa (Sooji)",
    category: "Sweets",
    categoryIcon: "🍮",
    serving: "100g",
    calories: 310,
    protein: 4.8,
    carbs: 48.0,
    fat: 11.5,
    fiber: 0.8,
    badge: "Comfort",
    price: 69,
    image:
      "https://images.unsplash.com/photo-1601303516534-bf5a93fc7c79?w=400&q=80",
    description: "Semolina pudding with ghee, cashews & raisins",
    isVegetarian: true,
    isSweet: true,
  },
];

const CATEGORIES = [
  "All",
  "Rice & Grains",
  "Proteins",
  "Curries & Lentils",
  "Salads",
  "Dairy & Sides",
  "Sweets",
];

const CATEGORY_COLORS = {
  "Rice & Grains": { bg: "#fef9c3", color: "#a16207", border: "#fde047" },
  Proteins: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  "Curries & Lentils": { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Salads: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "Dairy & Sides": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  Sweets: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
};

const NutrChip = ({ label, val, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 8,
      background: color + "12",
      border: `1px solid ${color}30`,
      minWidth: 56,
    }}
  >
    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
      {label}
    </span>
    <span style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span>
  </div>
);

const MenuBrowse = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { addToCart, totalCalories, getCartCount } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("calories");
  const [dietFilter, setDietFilter] = useState("all");
  const [addedItems, setAddedItems] = useState({});
  const [showWarningModal, setShowWarningModal] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const target = userProfile?.dailyCalorieTarget || 2000;
  const consumed = (userProfile?.dailyCaloriesConsumed || 0) + totalCalories;
  const remaining = target - consumed;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {}
  };

  const filteredFoods = FOOD_DATABASE.filter(
    (f) => activeCategory === "All" || f.category === activeCategory
  )
    .filter((f) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    })
    .filter((f) => {
      if (dietFilter === "vegetarian") return f.isVegetarian && !f.isSweet;
      if (dietFilter === "nonveg") return !f.isVegetarian;
      if (dietFilter === "sweets") return f.isSweet;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "calories") return a.calories - b.calories;
      if (sortBy === "protein") return b.protein - a.protein;
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });

  const handleAddToCart = (food) => {
    if (consumed + food.calories > target) setShowWarningModal(food);
    else doAddToCart(food);
  };

  const doAddToCart = (food) => {
    if (addToCart) addToCart(food);
    setAddedItems((prev) => ({ ...prev, [food.id]: true }));
    setTimeout(
      () => setAddedItems((prev) => ({ ...prev, [food.id]: false })),
      1800
    );
    setShowWarningModal(null);
  };

  const progPct = Math.min((consumed / target) * 100, 100);
  const progColor =
    consumed > target ? "#ef4444" : progPct > 80 ? "#f59e0b" : "#10b981";

  return (
    <div className="nd-root">
      <Navbar
        getCartCount={getCartCount}
        userProfile={userProfile}
        currentUser={currentUser}
        handleLogout={handleLogout}
        // setShowProfileModal={setShowProfileModal}
      />
      <div className="menu-browse-container">
        {/* ── Warning Modal ──────────────────────────────────────────────── */}
        {showWarningModal && (
          <div className="nd-overlay" onClick={() => setShowWarningModal(null)}>
            <div className="nd-warn-box" onClick={(e) => e.stopPropagation()}>
              <div className="nd-warn-icon">⚠️</div>
              <h2 className="nd-warn-title">Calorie Limit Warning</h2>
              <p className="nd-warn-body">
                Adding <strong>{showWarningModal.name}</strong> (
                {showWarningModal.calories} cal) will exceed your daily target
                by{" "}
                <strong style={{ color: "#ef4444" }}>
                  {consumed + showWarningModal.calories - target} cal
                </strong>
                .
              </p>
              <div className="nd-warn-stats">
                <div className="nd-warn-stat">
                  <span className="nd-warn-stat-label">Daily Target</span>
                  <span className="nd-warn-stat-val">{target} cal</span>
                </div>
                <div className="nd-warn-stat">
                  <span className="nd-warn-stat-label">Consumed</span>
                  <span className="nd-warn-stat-val">{consumed} cal</span>
                </div>
                <div className="nd-warn-stat">
                  <span className="nd-warn-stat-label">This Item</span>
                  <span className="nd-warn-stat-val danger">
                    +{showWarningModal.calories} cal
                  </span>
                </div>
              </div>
              <div className="nd-warn-actions">
                <button
                  className="nd-btn-warn-cancel"
                  onClick={() => setShowWarningModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="nd-btn-warn-confirm"
                  onClick={() => doAddToCart(showWarningModal)}
                >
                  Add Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="browse-header">
          <div>
            <h1 className="browse-title">Browse Menu</h1>
            <p className="browse-subtitle">
              Real nutrition data • Indian home-style meals
            </p>
          </div>
          {/* Mini calorie tracker */}
        </div>
        {/* ── Filters ───────────────────────────────────────────────────── */}
        <div className="filters-section">
          <div className="search-box">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* ── NEW Diet Filters: Vegetarian / Non-Veg / Sweets ── */}
          <div className="filter-buttons">
            {[
              ["all", "🍽️ All Items"],
              ["vegetarian", "🥬 Vegetarian"],
              ["nonveg", "🍗 Non-Veg"],
              ["sweets", "🍮 Sweets"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`filter-btn${dietFilter === v ? " active" : ""}`}
                onClick={() => setDietFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              color: "#374151",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="calories">Sort: Calories ↑</option>
            <option value="protein">Sort: Protein ↓</option>
            <option value="price">Sort: Price ↑</option>
          </select>
        </div>

        {/* ── Count ────────────────────────────────────────────────────── */}
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
          Showing{" "}
          <strong style={{ color: "#0f172a" }}>{filteredFoods.length}</strong>{" "}
          items
          {activeCategory !== "All" && (
            <>
              {" "}
              in <strong>{activeCategory}</strong>
            </>
          )}
        </p>

        {/* ── Food Grid ─────────────────────────────────────────────────── */}
        {filteredFoods.length === 0 ? (
          <div className="no-items">
            <div className="no-items-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredFoods.map((item) => {
              const catStyle = CATEGORY_COLORS[item.category] || {};
              const isAdded = addedItems[item.id];
              const wouldOver = consumed + item.calories > target;

              return (
                <div key={item.id} className="menu-card">
                  <div
                    className="menu-card-image"
                    style={{ position: "relative" }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80";
                        }}
                      />
                    ) : (
                      <div className="placeholder-image">🍽️</div>
                    )}
                    {/* Category badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 20,
                      }}
                    >
                      {item.categoryIcon} {item.category}
                    </div>
                    {/* Item badge */}
                    <div
                      className="item-badges"
                      style={{ top: 8, right: 8, left: "auto" }}
                    >
                      <span
                        style={{
                          background: "#0f172a",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    {/* Diet tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        display: "flex",
                        gap: 4,
                      }}
                    >
                      {item.isSweet && (
                        <span
                          style={{
                            background: "#fdf4ff",
                            color: "#7e22ce",
                            border: "1px solid #e9d5ff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 20,
                          }}
                        >
                          🍮 Sweet
                        </span>
                      )}
                      {!item.isSweet && item.isVegetarian && (
                        <span className="badge veg">🥬 Veg</span>
                      )}
                      {!item.isVegetarian && (
                        <span
                          style={{
                            background: "#fff1f2",
                            color: "#be123c",
                            border: "1px solid #fecdd3",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 20,
                          }}
                        >
                          🍗 Non-Veg
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="menu-card-content">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 4,
                      }}
                    >
                      <h3 className="item-name" style={{ margin: 0 }}>
                        {item.name}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          whiteSpace: "nowrap",
                          marginLeft: 6,
                        }}
                      >
                        {item.serving}
                      </span>
                    </div>
                    <p className="item-description">{item.description}</p>

                    {/* Calorie bar */}
                    <div style={{ margin: "10px 0 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ color: "#64748b" }}>Calories</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: wouldOver ? "#ef4444" : "#10b981",
                          }}
                        >
                          {item.calories} kcal {wouldOver && "⚠"}
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#f1f5f9",
                          borderRadius: 99,
                          height: 5,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(
                              (item.calories / target) * 100,
                              100
                            )}%`,
                            height: "100%",
                            borderRadius: 99,
                            background: wouldOver ? "#ef4444" : "#10b981",
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Nutrition chips */}
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        margin: "8px 0",
                      }}
                    >
                      <NutrChip
                        label="Protein"
                        val={`${item.protein}g`}
                        color="#6366f1"
                      />
                      <NutrChip
                        label="Carbs"
                        val={`${item.carbs}g`}
                        color="#f59e0b"
                      />
                      <NutrChip
                        label="Fat"
                        val={`${item.fat}g`}
                        color="#10b981"
                      />
                      <NutrChip
                        label="Fiber"
                        val={`${item.fiber}g`}
                        color="#0ea5e9"
                      />
                    </div>

                    {/* Footer */}
                    <div className="menu-card-footer">
                      <div className="item-price">₹{item.price}</div>
                      <button
                        className={`add-to-cart-btn${
                          wouldOver && !isAdded ? " warn" : ""
                        }${isAdded ? " added" : ""}`}
                        onClick={() => handleAddToCart(item)}
                        style={
                          isAdded
                            ? { background: "#10b981", borderColor: "#10b981" }
                            : wouldOver
                            ? { background: "#f59e0b", borderColor: "#f59e0b" }
                            : {}
                        }
                      >
                        {isAdded ? (
                          "✓ Added"
                        ) : (
                          <>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              width="16"
                              height="16"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            {wouldOver ? "⚠ Add Anyway" : "Add to Cart"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBrowse;
