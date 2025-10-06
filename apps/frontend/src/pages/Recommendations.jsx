// src/pages/Recommendations.jsx
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MapPanel from "../components/MapPanel";
import { videoData } from "../data/videoData";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function Recommendations() {
  const {
    mood,
    selectedDestinations,
    toggleSelect,
    recommendations,
    fetchRecommendations,
    loading,
  } = useContext(AppContext);

  const [budget, setBudget] = useState("");
  const [modalVideo, setModalVideo] = useState(null);
  const navigate = useNavigate();

  // ✅ Redirect if no quiz has been taken
  useEffect(() => {
    if (!mood) {
      navigate("/quiz");
    }
  }, [mood, navigate]);

  // ✅ Always re-fetch recommendations based on last quiz answers
  useEffect(() => {
    const lastAnswers = JSON.parse(localStorage.getItem("lastAnswers") || "[]");
    if (lastAnswers.length > 0) {
      fetchRecommendations(lastAnswers);
    }
  }, [fetchRecommendations]);

  const tolerance = 200;
  const list = recommendations.filter((r) => {
    if (!budget) return true;
    const userBudget = parseInt(budget, 10);
    if (isNaN(userBudget)) return true;
    return r.price >= userBudget - tolerance && r.price <= userBudget + tolerance;
  });

  function resetBudget() {
    setBudget("");
  }

  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-indigo-50 via-white to-orange-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full p-6">
        {/* === Left Panel === */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Recommended for You
              </h3>
              <p className="text-sm text-gray-600">
                Based on mood:{" "}
                <span className="font-medium capitalize text-indigo-600">
                  {mood}
                </span>
              </p>
            </div>

            {/* Budget Input */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600" htmlFor="budget">
                Budget
              </label>
              <input
                id="budget"
                type="number"
                placeholder="e.g. 1500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {budget && (
                <button
                  onClick={resetBudget}
                  className="px-3 py-2 text-xs font-medium bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 rounded-lg shadow hover:from-gray-300 hover:to-gray-200 transition"
                >
                  Show All
                </button>
              )}
            </div>
          </div>

          {loading && (
            <p className="mt-4 text-sm text-indigo-600">
              Loading recommendations...
            </p>
          )}
          {budget && !loading && (
            <p className="mt-4 text-sm text-indigo-600 font-medium">
              Showing trips within Ksh {budget} ± {tolerance}
            </p>
          )}

          {/* Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && list.length > 0 ? (
              list.map((r) => (
                <motion.div
                  key={r.id}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl overflow-hidden border bg-white shadow-md hover:shadow-xl transition flex flex-col"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded">
                        {r.tag}
                      </span>
                      <h4 className="font-semibold mt-2">{r.title}</h4>

                      {videoData[r.title] && (
                        <button
                          onClick={() => setModalVideo(videoData[r.title])}
                          className="mt-3 px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          🎥 Watch Video
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-indigo-600 font-bold">
                        Ksh {r.price}
                      </span>
                      <button
                        onClick={() => toggleSelect(r)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow ${
                          selectedDestinations.find((d) => d.id === r.id)
                            ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:from-green-600 hover:to-emerald-500"
                            : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                        }`}
                      >
                        {selectedDestinations.find((d) => d.id === r.id)
                          ? "✓ Selected"
                          : "Select"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              !loading && (
                <p className="text-gray-500 text-sm mt-4">
                  No destinations found within ±Ksh {tolerance} of your budget.
                </p>
              )
            )}
          </div>
        </div>

        {/* === Right Panel === */}
        {!modalVideo && (
          <aside className="bg-white rounded-2xl p-6 shadow-lg flex flex-col gap-4">
            <h4 className="font-semibold text-lg">🗺️ Trip Preview</h4>
            <div className="text-sm text-gray-500">Interactive Map</div>
            <MapPanel destinations={selectedDestinations} />

            <div className="mt-4 text-sm">
              Selected:{" "}
              <span className="font-medium text-indigo-600">
                {selectedDestinations.length}
              </span>{" "}
              items
            </div>

            <div className="mt-2 grid gap-2">
              {selectedDestinations.map((s) => (
                <div
                  key={s.id}
                  className="text-sm flex items-center justify-between border rounded-lg px-2 py-1 shadow-sm"
                >
                  <span>{s.title}</span>
                </div>
              ))}
            </div>

            <Link
              to="/itinerary"
              className="mt-4 w-full block text-center py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-medium shadow hover:from-indigo-600 hover:to-emerald-500"
            >
              Build Itinerary
            </Link>
          </aside>
        )}
      </div>

      {/* === Video Modal === */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 relative"
            >
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
              >
                ✕
              </button>
              <iframe
                className="w-full h-96 rounded"
                src={modalVideo}
                title="Destination Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
