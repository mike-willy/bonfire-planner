// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { db } from "../fireConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [maxPoints, setMaxPoints] = useState(1);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const q = query(
          collection(db, "leaderboard"), // 👈 assumes leaderboard collection
          orderBy("points", "desc"),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaders(data);

        if (data.length > 0) {
          setMaxPoints(data[0].points || 1); // highest points
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    }

    fetchLeaders();
  }, []);

  // Medal helper
  function getMedal(index) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  }

  // Avatar fallback (initials if no photo)
  function getAvatar(user) {
    if (user.photoURL)
      return (
        <img
          src={user.photoURL}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    const initials = user.displayName
      ? user.displayName.charAt(0).toUpperCase()
      : "T";
    return (
      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
        {initials}
      </div>
    );
  }

  return (
    <section className="mt-10 max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
        🏆 Leaderboard
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Top travelers ranked by points earned from trips & rewards.
      </p>

      {leaders.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">
          No leaderboard data yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {leaders.map((user, index) => {
            const progress = Math.min(
              (user.points / maxPoints) * 100,
              100
            ).toFixed(0);

            return (
              <div
                key={user.id}
                className="flex flex-col gap-2 py-4 px-3 hover:bg-gray-50 rounded-xl transition"
              >
                {/* Top row: Rank + Avatar + User Info + Points */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-xl">
                      {getMedal(index) || index + 1}
                    </span>
                    {getAvatar(user)}
                    <div>
                      <div className="font-medium text-gray-800">
                        {user.displayName || "Traveler"}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm">
                    {user.points || 0} pts
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
