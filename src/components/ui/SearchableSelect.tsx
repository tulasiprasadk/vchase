import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onSelect,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  allowCustom = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setCustomValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setCustomValue("");
  };

  const handleCustomSubmit = () => {
    if (customValue.trim() && allowCustom) {
      onSelect(customValue.trim());
      setIsOpen(false);
      setSearchTerm("");
      setCustomValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && allowCustom && customValue.trim()) {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span
          className={cn(
            selectedOption ? "text-gray-900 font-medium" : "text-gray-600"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

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
                  {value === option.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {searchTerm ? "No results found" : "No options available"}
              </div>
            )}

            {allowCustom &&
              searchTerm &&
              !filteredOptions.some(
                (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase()
              ) && (
                <div className="border-t">
                  <div className="p-2">
                    <input
                      type="text"
                      value={customValue || searchTerm}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add custom option..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleCustomSubmit}
                      className="mt-1 w-full px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      disabled={!(customValue || searchTerm).trim()}
                    >
                      Add &quot;{customValue || searchTerm}&quot;
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
