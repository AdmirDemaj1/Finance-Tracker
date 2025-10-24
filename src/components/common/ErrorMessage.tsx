import React from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning" | "info" | "success";
  onDismiss?: () => void;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = "error",
  onDismiss,
  title = "Error",
}) => {
  if (!message) return null;
  const typeClass = `error-message ${type}`;

  const getIcon = () => {
    switch (type) {
      case "error":
        // Todo:: Install and use icons from react-icons or mui icons
        return <FaExclamationTriangle />;
      case "warning":
        return <FaExclamationTriangle />;
      case "info":
        return <FaInfoCircle />;
      case "success":
        return <FaCheckCircle />;
      default:
        return <FaExclamationTriangle />;
    }
  };
  return (
    <div className={typeClass} role="alert">
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">
          {getIcon()}
        </span>
        <div className="error-text">
          {title && <strong className="error-title">{title}</strong>}
          <p className="error-description">{message}</p>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="error-dismiss"
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
