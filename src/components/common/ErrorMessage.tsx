import React from "react";

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
  return <div className="error-message"> {message} </div>;
};

export default ErrorMessage;
