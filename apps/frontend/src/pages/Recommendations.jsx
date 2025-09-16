import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MapPanel from "../components/MapPanel";
import { videoData } from "../data/videoData"; // ✅ Import video mapping

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
  const [modalVideo, setModalVideo] = useState(null); // ✅ store current video
  const navigate = useNavigate();

  if (!mood) {
    navigate("/quiz");
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchRecommendations(mood);
  }, [mood, fetchRecommendations]);

  const tolerance = 200;
  const list = recommendations.filter((r) => {
    if (!budget) return true;

    const userBudget = parseInt(budget, 10);
    if (isNaN(userBudget)) return true;

    const minBudget = userBudget - tolerance;
    const maxBudget = userBudget + tolerance;
    return r.price >= minBudget && r.price <= maxBudget;
  });

  function resetBudget() {
    setBudget("");
  }

  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-indigo-50 via-white to-orange-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full p-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Recommended for you</h3>
              <p className="text-sm text-gray-600">
                Based on mood:{" "}
                <span className="font-medium capitalize">{mood}</span>
              </p>
            </div>

            {/* Budget Input + Reset */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600" htmlFor="budget">
                Enter Budget
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
                  className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 rounded-lg shadow hover:from-gray-300 hover:to-gray-200 transition"
                >
                  Show All
                </button>
              )}
            </div>
          </div>

          {/* Loading or Budget Info */}
          {loading && (
            <p className="mt-4 text-sm text-indigo-600">
              Loading recommendations...
            </p>
          )}
          {budget && !loading && (
            <p className="mt-4 text-sm text-indigo-600 font-medium">
              Showing trips within ${budget} ± ${tolerance}
            </p>
          )}

          {/* Destination Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && list.length > 0 ? (
              list.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg overflow-hidden border bg-white shadow hover:shadow-lg transition flex flex-col"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-gray-500">{r.tag}</div>
                      <div className="font-semibold">{r.title}</div>
                      {/* ✅ Video Button */}
                      {videoData[r.title] && (
                        <div className="mt-3">
                          <button
                            onClick={() => setModalVideo(videoData[r.title])}
                            className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            View Video
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end mt-3">
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
                </div>
              ))
            ) : (
              !loading && (
                <p className="text-gray-500 text-sm mt-4">
                  No destinations found within ±${tolerance} of your budget.
                </p>
              )
            )}
          </div>
        </div>

        {/* Right Panel */}
        {!modalVideo && (
  <aside className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
    <div className="text-sm text-gray-600">Interactive Map</div>
    <MapPanel destinations={selectedDestinations} />

    <div className="mt-4">
      <h4 className="font-semibold text-sm">Trip Preview</h4>
      <div className="text-xs text-gray-500">
        Selected: {selectedDestinations.length} items
      </div>
      <div className="mt-2 grid gap-2">
        {selectedDestinations.map((s) => (
          <div
            key={s.id}
            className="text-sm flex items-center justify-between"
          >
            <div>{s.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link
          to="/itinerary"
          className="w-full block text-center py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-medium shadow hover:from-indigo-600 hover:to-emerald-500"
        >
          Build Itinerary
        </Link>
      </div>
    </div>
  </aside>
)}
      </div>

      {/* ✅ Video Modal */}
      {modalVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
            <button
              onClick={() => setModalVideo(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl"
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
          </div>
        </div>
      )}
    </section>
  );
}
