// src/context/AppContext.jsx
import { createContext, useState, useCallback, useEffect } from "react";
import { auth, db } from "../fireConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState(() => {
    const cached = localStorage.getItem("userTrips");
    return cached ? JSON.parse(cached) : [];
  });

  // ✅ Load from localStorage
  const [mood, setMood] = useState(() => localStorage.getItem("mood") || null);
  const [recommendations, setRecommendations] = useState(() => {
    const cached = localStorage.getItem("recommendations");
    return cached ? JSON.parse(cached) : [];
  });

  const [availableMoods, setAvailableMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [pendingItinerary, setPendingItinerary] = useState(null);

  // ✅ Persist mood/recommendations
  useEffect(() => {
    if (mood) localStorage.setItem("mood", mood);
  }, [mood]);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem("recommendations", JSON.stringify(recommendations));
    }
  }, [recommendations]);

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

  // ✅ Fetch moods (optional)
  const fetchMoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/moods`);
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

  // ✅ Fetch recommendations based on answers
  const fetchRecommendations = useCallback(async (answers) => {
    if (!answers || !answers.length) return;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/quiz-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();

      setMood(data.mood);
      setRecommendations(data.recommendations || []);

      // ✅ Save to cache
      localStorage.setItem("mood", data.mood);
      localStorage.setItem("recommendations", JSON.stringify(data.recommendations || []));
      localStorage.setItem("lastAnswers", JSON.stringify(answers)); // 👈 store latest answers
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Could not load recommendations. Please try again.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Clear mood & recs when starting a new quiz
  const resetQuiz = () => {
    setMood(null);
    setRecommendations([]);
    localStorage.removeItem("mood");
    localStorage.removeItem("recommendations");
    localStorage.removeItem("lastAnswers");
  };

  // ✅ Select / deselect destinations
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
        trips,
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
        resetQuiz, // 👈 expose reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
