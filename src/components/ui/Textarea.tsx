import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

export { Textarea };
