// src/pages/Checkout.jsx
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Checkout() {
  const { selectedDestinations, mood, budget, pendingItinerary } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const total = selectedDestinations.reduce((sum, d) => sum + d.price, 0);

  // ✅ Confirm booking
  async function handleConfirm() {
    if (!auth.currentUser) {
      alert("⚠️ Please sign in before confirming booking.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      // --- Save itinerary ---
      await addDoc(collection(db, "itineraries"), {
        userId: auth.currentUser.uid,
        mood: mood || null,
        budget: budget || null,
        destinations: selectedDestinations,
        total,
        travelDate: pendingItinerary?.travelDate || null,
        createdAt: serverTimestamp(),
      });

      // --- Update user points & badges ---
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      let userData = {};
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // if first time, create user record
        await setDoc(userRef, {
          displayName: auth.currentUser.displayName || "Traveler",
          email: auth.currentUser.email,
          points: 0,
          badges: [],
        });
        userData = { points: 0, badges: [] };
      }

      // Add points
      let newPoints = (userData.points || 0) + 100;

      // Badge rules
      const badges = new Set(userData.badges || []);
      if (selectedDestinations.length >= 3) {
        badges.add("Explorer");
      }
      if (total <= 5000) {
        badges.add("Budget Master");
      }
      if (
        selectedDestinations.some((d) =>
          d.tag?.toLowerCase().includes("culture")
        )
      ) {
        badges.add("Cultural Seeker");
      }

      // Update Firestore
      await updateDoc(userRef, {
        points: newPoints,
        badges: Array.from(badges),
      });

      alert("✅ Booking confirmed! 🚀 Points & rewards updated.");
      navigate("/profile");
    } catch (err) {
      console.error("Error saving booking:", err);
      alert("❌ Could not save booking. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-orange-50 via-white to-indigo-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-semibold">Booking Checkout</h2>
        <p className="text-sm text-gray-600">
          Review your trip details before confirming.
        </p>

        {/* Destinations */}
        <div className="mt-6 space-y-3">
          {selectedDestinations.map((d) => (
            <div
              key={d.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3"
            >
              <div>
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-gray-500">{d.tag}</div>
              </div>
              <div className="font-semibold">Ksh{d.price}</div>
            </div>
          ))}
        </div>

        {/* Show Travel Date */}
        {pendingItinerary?.travelDate && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold">Travel Date: </span>
            {pendingItinerary.travelDate}
          </div>
        )}

        {/* Total */}
        <div className="mt-4 flex justify-between border-t pt-4">
          <div className="font-semibold">Total</div>
          <div className="font-bold text-indigo-600">Ksh{total}</div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/itinerary")}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </section>
  );
}
