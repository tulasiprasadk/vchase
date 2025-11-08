import React, { createContext, useContext, useState, useEffect } from "react";

export type LayoutMode = "grid" | "list" | "compact";
export type CardSize = "small" | "medium" | "large";

interface LayoutSettings {
  mode: LayoutMode;
  cardSize: CardSize;
  showMetrics: boolean;
  compactSidebar: boolean;
}

interface LayoutContextType {
  settings: LayoutSettings;
  updateLayout: (settings: Partial<LayoutSettings>) => void;
  resetLayout: () => void;
}

const defaultSettings: LayoutSettings = {
  mode: "grid",
  cardSize: "medium",
  showMetrics: true,
  compactSidebar: false,
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<LayoutSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-layout");
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error("Error loading layout settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard-layout", JSON.stringify(settings));
  }, [settings]);

  const updateLayout = (newSettings: Partial<LayoutSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetLayout = () => {
    setSettings(defaultSettings);
  };

  return (
    <LayoutContext.Provider value={{ settings, updateLayout, resetLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
