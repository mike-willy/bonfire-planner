// src/context/AppContext.jsx
import { createContext, useState, useCallback, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState(() => {
    // ✅ Load from cache on startup
    const cached = localStorage.getItem("userTrips");
    return cached ? JSON.parse(cached) : [];
  });
  const [mood, setMood] = useState(null);
  const [availableMoods, setAvailableMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [pendingItinerary, setPendingItinerary] = useState(null);

  // ✅ Track Firebase Auth state + trips
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        const q = query(
          collection(db, "itineraries"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubTrips = onSnapshot(q, (snapshot) => {
          const tripsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTrips(tripsData);

          // ✅ Save to cache
          localStorage.setItem("userTrips", JSON.stringify(tripsData));
        });

        return () => unsubTrips();
      } else {
        setTrips([]);
        localStorage.removeItem("userTrips");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch moods
  const fetchMoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/moods");
      if (!response.ok) throw new Error("Failed to fetch moods");
      const data = await response.json();
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

  // ✅ Fetch recommendations
  const fetchRecommendations = useCallback(async (selectedMood) => {
    if (!selectedMood) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Could not load recommendations. Please try again.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Select / deselect
  const toggleSelect = (destination) => {
    setSelectedDestinations((prev) =>
      prev.find((d) => d.id === destination.id)
        ? prev.filter((d) => d.id !== destination.id)
        : [...prev, destination]
    );
  };

  const clearAllDestinations = () => setSelectedDestinations([]);
  const removeDestination = (id) =>
    setSelectedDestinations((prev) => prev.filter((d) => d.id !== id));

  return (
    <AppContext.Provider
      value={{
        user,
        trips,                // ✅ trips always available
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
        clearAllDestinations,
        removeDestination,
        pendingItinerary,
        setPendingItinerary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
