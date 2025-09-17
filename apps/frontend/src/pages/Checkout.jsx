// src/pages/Checkout.jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { selectedDestinations } = useContext(AppContext);
  const navigate = useNavigate();

  const total = selectedDestinations.reduce((sum, d) => sum + d.price, 0);

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
            onClick={() => alert("Booking confirmed! 🚀")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white text-sm font-medium"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </section>
  );
}
