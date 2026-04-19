import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (userData.name) {
        await updateProfile(user, { displayName: userData.name });
      }

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "customer",
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "userProfiles", user.uid), {
        name: userData.name,
        profileCompleted: false,
        age: null,
        height: null,
        weight: null,
        gender: null,
        activityLevel: "moderate",
        goal: "maintain",
        dailyCalorieTarget: 2000,
        dailyCaloriesConsumed: 0,
        lastReset: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId) => {
    setProfileLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", userId));

      if (!userDoc.exists()) {
        // Auto-create missing docs
        const defaultData = {
          email: auth.currentUser?.email,
          role: "customer",
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", userId), defaultData);

        const defaultProfile = {
          name: auth.currentUser?.displayName || "",
          profileCompleted: false,
          age: null,
          height: null,
          weight: null,
          gender: null,
          activityLevel: "moderate",
          goal: "maintain",
          dailyCalorieTarget: 2000,
          dailyCaloriesConsumed: 0,
          lastReset: new Date().toISOString(),
        };
        await setDoc(doc(db, "userProfiles", userId), defaultProfile);
        setUserProfile({ ...defaultData, ...defaultProfile, userId });
        return;
      }

      const userData = userDoc.data();

      if (userData.role === "customer") {
        const profileDoc = await getDoc(doc(db, "userProfiles", userId));

        if (profileDoc.exists()) {
          setUserProfile({ ...userData, ...profileDoc.data(), userId });
        } else {
          // Recreate missing userProfiles doc
          const defaultProfile = {
            name: auth.currentUser?.displayName || "",
            profileCompleted: false,
            age: null,
            height: null,
            weight: null,
            gender: null,
            activityLevel: "moderate",
            goal: "maintain",
            dailyCalorieTarget: 2000,
            dailyCaloriesConsumed: 0,
            lastReset: new Date().toISOString(),
          };
          await setDoc(doc(db, "userProfiles", userId), defaultProfile);
          setUserProfile({ ...userData, ...defaultProfile, userId });
        }
      } else {
        setUserProfile({ ...userData, userId });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateUserProfile = async (userId, updates) => {
    try {
      await setDoc(doc(db, "userProfiles", userId), updates, { merge: true });
      setUserProfile((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    updateUserProfile,
    loading,
    profileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
