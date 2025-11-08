import React from "react";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface VerifiedBadgeProps {
  verificationStatus: "pending" | "approved" | "rejected" | "not_requested";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verificationStatus,
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const renderBadge = () => {
    switch (verificationStatus) {
      case "approved":
        return (
          <div className={`flex items-center text-green-600 ${className}`}>
            <CheckCircle className={`${sizeClasses[size]} mr-1`} />
            {showText && (
              <span className={textSizeClasses[size]}>Verified</span>
            )}
          </div>
        );

      case "pending":
        return (
          <div className={`flex items-center text-yellow-600 ${className}`}>
            <Clock className={`${sizeClasses[size]} mr-1`} />
            {showText && <span className={textSizeClasses[size]}>Pending</span>}
          </div>
        );

      case "rejected":
        return (
          <div className={`flex items-center text-red-600 ${className}`}>
            <XCircle className={`${sizeClasses[size]} mr-1`} />
            {showText && (
              <span className={textSizeClasses[size]}>Rejected</span>
            )}
          </div>
        );

      case "not_requested":
      default:
        return (
          <div className={`flex items-center text-gray-500 ${className}`}>
            <AlertCircle className={`${sizeClasses[size]} mr-1`} />
            {showText && (
              <span className={textSizeClasses[size]}>Not Verified</span>
            )}
          </div>
        );
    }
  };

  return renderBadge();
};

export default VerifiedBadge;
