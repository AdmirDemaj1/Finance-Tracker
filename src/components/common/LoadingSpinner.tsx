import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Thinking...",
  size = "medium",
}) => {
  const sizeClass = `spinner-${size}`;
  return (
    <div className={"loading-container"} role="status">
      <div className={`spinner ${sizeClass}`} aria-hidden="true">
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-message"> {message} </p>
      <span className="sr-only"> {message} </span>
    </div>
  );
};

export default LoadingSpinner;