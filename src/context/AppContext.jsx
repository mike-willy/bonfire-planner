import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [mood, setMood] = useState(null);
  const [budget, setBudget] = useState(1000);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  function toggleSelect(dest) {
    setSelectedDestinations((prev) => {
      const exists = prev.find((d) => d.id === dest.id);
      if (exists) return prev.filter((d) => d.id !== dest.id);
      return [...prev, dest];
    });
  }

  function clearSelection() {
    setSelectedDestinations([]);
  }

  return (
    <AppContext.Provider
      value={{ mood, setMood, budget, setBudget, selectedDestinations, toggleSelect, clearSelection }}
    >
      {children}
    </AppContext.Provider>
  );
}
