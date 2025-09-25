// src/pages/Rewards.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Rewards() {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  // ✅ Listen to user rewards in Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPoints(data.points || 0);
        setBadges(data.badges || []);
      }
    });

    return () => unsubscribe();
  }, []);

  // Default badges list (with locked/earned state)
  const allBadges = [
    { id: 1, label: "Explorer", desc: "Visited 3+ destinations" },
    { id: 2, label: "Budget Master", desc: "Planned under ksh5000" },
    { id: 3, label: "Cultural Seeker", desc: "Took 2+ cultural trips" },
    { id: 4, label: "Globetrotter", desc: "Completed 5+ trips" },
  ];

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold">Your Rewards</h2>
      <p className="text-sm text-gray-600">
        Earn points and badges as you explore with Bonfire Adventures.
      </p>

      {/* Points Display */}
      <div className="mt-6 flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <span className="text-2xl">🌟</span>
        <div>
          <div className="font-semibold text-indigo-700">Total Points</div>
          <div className="text-lg font-bold text-indigo-900">{points}</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allBadges.map((b) => {
          const earned = badges.includes(b.label);
          return (
            <div
              key={b.id}
              className={`p-4 rounded-lg border text-center transition ${
                earned
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200 opacity-70"
              }`}
            >
              <div className="text-lg font-semibold">{b.label}</div>
              <div className="text-xs text-gray-500 mt-1">{b.desc}</div>
              <div className="mt-2 text-sm font-medium">
                {earned ? "✅ Earned" : "🔒 Locked"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
