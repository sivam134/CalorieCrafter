import React from "react";

// Simple SVG Logo Component - Use this until you have your custom logo
const Logo = ({ className = "" }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="20" cy="20" r="20" fill="#10b981" />

      {/* Leaf/Health Symbol */}
      <path
        d="M20 8C15.5817 8 12 11.5817 12 16C12 20.4183 15.5817 24 20 24C20.5523 24 21 23.5523 21 23V17C21 16.4477 20.5523 16 20 16C19.4477 16 19 16.4477 19 17V21.9C16.1401 21.4381 14 19.0247 14 16C14 12.6863 16.6863 10 20 10C23.3137 10 26 12.6863 26 16C26 19.0247 23.8599 21.4381 21 21.9V23.9C24.866 23.3878 28 20.0622 28 16C28 11.5817 24.4183 8 20 8Z"
        fill="white"
      />

      {/* Fork Symbol */}
      <path
        d="M18 26C18 25.4477 18.4477 25 19 25H21C21.5523 25 22 25.4477 22 26V30C22 30.5523 21.5523 31 21 31H19C18.4477 31 18 30.5523 18 30V26Z"
        fill="white"
      />
      <path
        d="M16 28C16 27.4477 16.4477 27 17 27H23C23.5523 27 24 27.4477 24 28C24 28.5523 23.5523 29 23 29H17C16.4477 29 16 28.5523 16 28Z"
        fill="white"
      />
    </svg>
  );
};

export default Logo;

// USAGE INSTRUCTIONS:
// --------------------
// 1. Save this file as: src/components/Logo.jsx
//
// 2. In your Home.jsx, replace the logo img tags with:
//    import Logo from '../components/Logo';
//
//    Then replace:
//    <img src="/logo.png" alt="NutriOrder Logo" className="logo-img" />
//
//    With:
//    <Logo className="logo-img" />
//
// 3. This creates a modern, health-focused logo with:
//    - Green circular background (matches your primary color)
//    - Leaf/apple symbol (represents health/nutrition)
//    - Fork symbol (represents food/dining)
//
// 4. To customize the color, change the fill="#10b981" to your color
//
// 5. When you get a real logo, simply replace the Logo component
//    with your actual logo image
