import React from "react";
import {
  Settings,
  Grid3X3,
  List,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  EyeOff,
  RotateCcw,
  X,
} from "lucide-react";
import { useLayout, LayoutMode, CardSize } from "@/context/LayoutContext";
import Button from "@/components/ui/Button";

interface LayoutCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutCustomizer: React.FC<LayoutCustomizerProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateLayout, resetLayout } = useLayout();

  if (!isOpen) return null;

  const layoutModes: {
    value: LayoutMode;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      value: "grid",
      label: "Grid View",
      icon: <Grid3X3 className="h-5 w-5" />,
      description: "Cards arranged in a responsive grid",
    },
    {
      value: "list",
      label: "List View",
      icon: <List className="h-5 w-5" />,
      description: "Vertical list with detailed information",
    },
    {
      value: "compact",
      label: "Compact View",
      icon: <Minimize2 className="h-5 w-5" />,
      description: "Dense layout with minimal spacing",
    },
  ];

  const cardSizes: { value: CardSize; label: string; icon: React.ReactNode }[] =
    [
      {
        value: "small",
        label: "Small",
        icon: <Smartphone className="h-4 w-4" />,
      },
      {
        value: "medium",
        label: "Medium",
        icon: <Tablet className="h-4 w-4" />,
      },
      { value: "large", label: "Large", icon: <Monitor className="h-4 w-4" /> },
    ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Layout
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Layout Mode */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Layout Mode
            </h3>
            <div className="space-y-2">
              {layoutModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => updateLayout({ mode: mode.value })}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:bg-gray-50 ${
                    settings.mode === mode.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 ${
                        settings.mode === mode.value
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          settings.mode === mode.value
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {mode.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {mode.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Size */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Card Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {cardSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateLayout({ cardSize: size.value })}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all hover:bg-gray-50 ${
                    settings.cardSize === size.value
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {size.icon}
                  <span className="text-xs font-medium">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Display Options
            </h3>

            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.showMetrics ? (
                  <Eye className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700">Show Metrics</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showMetrics}
                onChange={(e) =>
                  updateLayout({ showMetrics: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Minimize2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Compact Sidebar</span>
              </div>
              <input
                type="checkbox"
                checked={settings.compactSidebar}
                onChange={(e) =>
                  updateLayout({ compactSidebar: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={resetLayout}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={onClose}>Apply Changes</Button>
        </div>
      </div>
    </div>
  );
};
