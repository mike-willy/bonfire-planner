// src/pages/Itinerary.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

// 📅 Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Itinerary() {
  const { 
    selectedDestinations, 
    clearAllDestinations, 
    removeDestination, 
    mood, 
    budget,
    setPendingItinerary
  } = useContext(AppContext);

  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [travelDate, setTravelDate] = useState(null); 
  const navigate = useNavigate();

  // ✅ Fetch mood rule (optional)
  useEffect(() => {
    async function fetchRule() {
      if (!mood) return;
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/rules/${mood}`);
        if (!res.ok) throw new Error("Failed to fetch rule");
        const data = await res.json();
        setRule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRule();
  }, [mood]);

  const total = selectedDestinations.reduce((sum, d) => sum + d.price, 0);

  function budgetStatus(price) {
    if (!rule) return "within";
    if (price <= budget) return "within";
    if (price <= rule.conditions.budget.max) return "above";
    return "over";
  }
  const status = budgetStatus(total);

  // ✅ Handle Proceed to Book
  function handleProceed() {
    if (selectedDestinations.length === 0) {
      alert("⚠️ Please select at least one destination!");
      return;
    }
    if (!travelDate) {
      alert("⚠️ Please select a travel date!");
      return;
    }

    // Always save itinerary (even if logged in)
    setPendingItinerary({
      mood,
      budget,
      destinations: selectedDestinations,
      total,
      travelDate: travelDate.toISOString().split("T")[0], // formatted
    });

    if (!auth.currentUser) {
      alert("⚠️ Please sign up or log in first to continue.");
      navigate("/auth");
    } else {
      navigate("/checkout");
    }
  }

  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-indigo-50 via-white to-orange-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-semibold">Your Itinerary</h2>
        <p className="text-sm text-gray-600">
          Here are the destinations you’ve selected.
        </p>

        {selectedDestinations.length === 0 ? (
          <div className="mt-6 text-gray-500 text-sm">
            No destinations selected yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {selectedDestinations.map((d) => (
              <div
                key={d.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3"
              >
                <div className="mb-2 sm:mb-0">
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-gray-500">{d.tag}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold">Ksh{d.price}</div>
                  <button
                    onClick={() => removeDestination(d.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t pt-4 gap-2">
              <div className="font-semibold">Total</div>
              <div
                className={`px-3 py-1 rounded text-sm font-bold ${
                  status === "within"
                    ? "bg-green-100 text-green-700"
                    : status === "above"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Ksh{total}
              </div>
            </div>

            {/* 📅 Travel Date */}
            <div className="mt-6">
              <label className="block font-medium mb-2">
                Select Travel Date:
              </label>
              <DatePicker
                selected={travelDate}
                onChange={(date) => setTravelDate(date)}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                placeholderText="Click to choose a date"
                className="border rounded-lg p-2 w-full"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearAllDestinations}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white text-sm font-medium"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4 text-sm text-gray-500">
            Loading budget rules...
          </div>
        )}
      </div>
    </section>
  );
}
