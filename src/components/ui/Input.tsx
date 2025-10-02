import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  className,
  type,
  label,
  error,
  helperText,
  suffixIcon,
  onSuffixClick,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-900"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:text-slate-400",
            error && "border-red-500 focus:ring-red-500",
            suffixIcon && "pr-10",
            className
          )}
          {...props}
        />
        {suffixIcon && (
          <button
            type="button"
            onClick={onSuffixClick}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {suffixIcon}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
