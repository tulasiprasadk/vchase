import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Option {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  className?: string;
  maxSelections?: number;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search or add new...",
  allowCustom = false,
  className,
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(option.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (maxSelections && value.length >= maxSelections) {
      return;
    }

    if (!value.includes(optionValue)) {
      onChange([...value, optionValue]);
    }
    setSearchTerm("");
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleAddCustom = () => {
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch && allowCustom && !value.includes(trimmedSearch)) {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onChange([...value, trimmedSearch]);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim() && allowCustom) {
        handleAddCustom();
      } else if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      }
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {value.length > 0 ? (
            <>
              {value.map((val) => {
                const option = options.find((opt) => opt.value === val);
                const label = option ? option.label : val;
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                    />
                  </Badge>
                );
              })}
              {(!maxSelections || value.length < maxSelections) && (
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm text-gray-900"
                  placeholder=""
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none outline-none bg-transparent text-gray-900 placeholder:text-gray-600"
              placeholder={placeholder}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {(!maxSelections || value.length < maxSelections) && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))
            ) : searchTerm ? (
              allowCustom ? (
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-600"
                  disabled={
                    !searchTerm.trim() || value.includes(searchTerm.trim())
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add &quot;{searchTerm}&quot;
                </button>
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No results found
                </div>
              )
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {maxSelections && value.length >= maxSelections
                  ? `Maximum ${maxSelections} selections reached`
                  : "Start typing to search..."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
