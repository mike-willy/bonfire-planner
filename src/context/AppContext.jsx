import { createContext, useState, useCallback } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [mood, setMood] = useState(null);
  const [availableMoods, setAvailableMoods] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
const [selectedDestinations, setSelectedDestinations] = useState([]);

  // ✅ Fetch moods from backend
  const fetchMoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/moods"); // 👈 update port if needed
      if (!response.ok) throw new Error("Failed to fetch moods");
      const data = await response.json();

      // ✅ backend sends { moods: [...] }
      const moods = data.moods || [];
      setAvailableMoods(Array.isArray(moods) ? moods : []);
    } catch (err) {
      console.error("Error fetching moods:", err);
      setError("Could not load moods. Please try again.");
      setAvailableMoods([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
   // Fetch recommendations
  const fetchRecommendations = useCallback(async (mood) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recommendations?mood=${mood}`);
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle selection
  const toggleSelect = (destination) => {
    setSelectedDestinations((prev) =>
      prev.find((d) => d.id === destination.id)
        ? prev.filter((d) => d.id !== destination.id)
        : [...prev, destination]
    );
  };

  return (
    <AppContext.Provider
      value={{
        mood,
        setMood,
        availableMoods,
        fetchMoods,
        loading,
        error,
        recommendations,
        fetchRecommendations,
        selectedDestinations,
        toggleSelect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
