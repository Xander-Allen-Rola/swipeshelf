import React from "react";
import "./LoadingOverlay.css";

function LoadingOverlay({ show, text = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingOverlay;
