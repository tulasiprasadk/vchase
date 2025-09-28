import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    destructive: "bg-red-100 text-red-800 hover:bg-red-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const classes = [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
};

export default Badge;
export { Badge };
