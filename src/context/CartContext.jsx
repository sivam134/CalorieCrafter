import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

// Create Context
const CartContext = createContext({});

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      }
    } else {
      // Clear cart if no user
      setCartItems([]);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && cartItems.length > 0) {
      localStorage.setItem(
        `cart_${currentUser.uid}`,
        JSON.stringify(cartItems)
      );
    }

    // Calculate totals
    const calories = cartItems.reduce(
      (sum, item) => sum + item.calories * item.quantity,
      0
    );
    const amount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalCalories(calories);
    setTotalAmount(amount);
  }, [cartItems, currentUser]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.menuItemId === item.menuItemId
      );

      if (existingItem) {
        // Increase quantity
        return prevItems.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (menuItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.menuItemId !== menuItemId)
    );
  };

  // Update item quantity
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.uid}`);
    }
  };

  // Check if adding item exceeds calorie limit
  const checkCalorieLimit = (item, calorieLimit) => {
    const newCalories = totalCalories + item.calories;
    return {
      willExceed: newCalories > calorieLimit,
      currentCalories: totalCalories,
      newCalories,
      calorieLimit,
      remaining: calorieLimit - newCalories,
    };
  };

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Get macronutrient totals
  const getMacroTotals = () => {
    return {
      protein: cartItems.reduce(
        (sum, item) => sum + (item.protein || 0) * item.quantity,
        0
      ),
      carbs: cartItems.reduce(
        (sum, item) => sum + (item.carbs || 0) * item.quantity,
        0
      ),
      fats: cartItems.reduce(
        (sum, item) => sum + (item.fats || 0) * item.quantity,
        0
      ),
    };
  };

  const value = {
    cartItems,
    totalCalories,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkCalorieLimit,
    getCartCount,
    getMacroTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
