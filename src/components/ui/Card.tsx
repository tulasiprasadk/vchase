import React from "react";
import { cn } from "@/utils/cn";

type CardProps = React.ComponentPropsWithoutRef<"div">;

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn("p-6 pb-4", className)}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn("p-6 pt-4", className)}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
