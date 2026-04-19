import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #10b981",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ color: "#64748b", fontSize: "14px" }}>Loading...</p>
  </div>
);

const PublicRoute = ({ children }) => {
  const { currentUser, userProfile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return <LoadingSpinner />;
  }

  // Already logged in → send to dashboard
  if (currentUser && userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
