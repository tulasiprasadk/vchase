import React from "react";
import { LucideIcon } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
}) => {
  const { settings } = useLayout();

  const getCardSizeClasses = () => {
    const base =
      "bg-white rounded-lg shadow hover:shadow-md transition-all duration-200";

    switch (settings.cardSize) {
      case "small":
        return `${base} p-3`;
      case "large":
        return `${base} p-8`;
      default:
        return `${base} p-4 lg:p-6`;
    }
  };

  const getIconSizeClasses = () => {
    switch (settings.cardSize) {
      case "small":
        return "w-8 h-8";
      case "large":
        return "w-14 h-14";
      default:
        return "w-10 h-10 lg:w-12 lg:h-12";
    }
  };

  const getIconClasses = () => {
    switch (settings.cardSize) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-8 w-8";
      default:
        return "h-5 w-5 lg:h-6 lg:w-6";
    }
  };

  const getTitleClasses = () => {
    switch (settings.cardSize) {
      case "small":
        return "text-xs font-medium text-gray-900 truncate";
      case "large":
        return "text-xl font-medium text-gray-900 truncate";
      default:
        return "text-sm lg:text-lg font-medium text-gray-900 truncate";
    }
  };

  const getValueClasses = () => {
    switch (settings.cardSize) {
      case "small":
        return "text-lg font-bold";
      case "large":
        return "text-4xl font-bold";
      default:
        return "text-xl lg:text-2xl font-bold";
    }
  };

  const getColorClasses = (baseColor: string) => {
    return {
      background: `bg-${baseColor}-100`,
      text: `text-${baseColor}-600`,
      value: `text-${baseColor}-600`,
    };
  };

  const colorClasses = getColorClasses(color);

  // List view layout
  if (settings.mode === "list") {
    return (
      <div
        className={`${getCardSizeClasses()} cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`${getIconSizeClasses()} ${
                colorClasses.background
              } rounded-full flex items-center justify-center`}
            >
              <Icon className={`${getIconClasses()} ${colorClasses.text}`} />
            </div>
            <div>
              <h3 className={getTitleClasses()}>{title}</h3>
              {trend && (
                <p className="text-xs text-gray-500">
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className={`${getValueClasses()} ${colorClasses.value}`}>
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Compact view layout
  if (settings.mode === "compact") {
    return (
      <div
        className={`${getCardSizeClasses()} cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div
            className={`${getIconSizeClasses()} ${
              colorClasses.background
            } rounded-full flex items-center justify-center`}
          >
            <Icon className={`${getIconClasses()} ${colorClasses.text}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={getTitleClasses()}>{title}</h3>
            <p className={`${getValueClasses()} ${colorClasses.value}`}>
              {value}
            </p>
          </div>
          {trend && (
            <div className="text-right">
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default grid view layout
  return (
    <div className={`${getCardSizeClasses()} cursor-pointer`} onClick={onClick}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`${getIconSizeClasses()} ${
              colorClasses.background
            } rounded-full flex items-center justify-center`}
          >
            <Icon className={`${getIconClasses()} ${colorClasses.text}`} />
          </div>
        </div>
        <div className="ml-3 lg:ml-4 min-w-0 flex-1">
          <h3 className={getTitleClasses()}>{title}</h3>
          <div className="flex items-center gap-2">
            <p className={`${getValueClasses()} ${colorClasses.value}`}>
              {value}
            </p>
            {trend && (
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
