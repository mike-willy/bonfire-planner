// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const q = query(
          collection(db, "users"), // 👈 assumes you store users in "users" collection
          orderBy("points", "desc"),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaders(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    }

    fetchLeaders();
  }, []);

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold">🏆 Leaderboard</h2>
      <p className="text-sm text-gray-600 mb-4">
        Top travelers ranked by points earned from trips & rewards.
      </p>

      <div className="divide-y">
        {leaders.length === 0 ? (
          <p className="text-gray-500 text-sm">No leaderboard data yet.</p>
        ) : (
          leaders.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-5">
                <span className="font-bold text-indigo-600 w-2 text-right">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium">
                    {user.displayName || "Traveler"}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="font-semibold text-green-600">
                {user.points || 0} pts
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
