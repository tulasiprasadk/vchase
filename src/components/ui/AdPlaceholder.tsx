import React from "react";

interface AdPlaceholderProps {
  className?: string;
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  className = "",
  label = "Ad",
}) => {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-slate-300 bg-white rounded-md p-4 text-sm text-slate-600 ${className}`}
      aria-hidden
    >
      <div className="text-center">
        <div className="font-medium text-slate-700 mb-1">{label}</div>
        <div className="text-xs text-slate-400">Sponsor space</div>
      </div>
    </div>
  );
};

export default AdPlaceholder;
