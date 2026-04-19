import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return <LoadingSpinner />;
  }

  // Not logged in → redirect to login, remember where they were trying to go
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "You must be logged in to access this page.",
        }}
      />
    );
  }

  if (!userProfile) {
    return <LoadingSpinner />;
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "You don't have permission to access this page." }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
