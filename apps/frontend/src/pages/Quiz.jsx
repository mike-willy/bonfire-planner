import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  MapPin,
  Heart,
  Star,
  Users,
  Music,
  TreePine,
  CheckCircle2,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const MotionButton = motion.button;

// Map mood IDs to icons + images
const moodAssets = {
  relaxed: { icon: <Sun size={22} />, image: "/Images/moods/Relaxed.jpg" },
  adventurous: { icon: <MapPin size={22} />, image: "/Images/moods/Adventurous.jpg" },
  romantic: { icon: <Heart size={22} />, image: "/Images/moods/Romantic.jpeg" },
  cultural: { icon: <Star size={22} />, image: "/Images/moods/Cultural.jpeg" },
  family: { icon: <Users size={22} />, image: "/Images/moods/Family.jpeg" },
  party: { icon: <Music size={22} />, image: "/Images/moods/party.webp" },
  nature: { icon: <TreePine size={22} />, image: "/Images/moods/Nature.jpg" },
};

export default function Quiz() {
  const navigate = useNavigate();
  const { setMood, availableMoods = [], fetchMoods, loading, error } =
    useContext(AppContext); // ✅ safe default
  const [selectedMood, setSelectedMood] = useState(null);

  // ✅ Fetch moods from backend on mount
  useEffect(() => {
    fetchMoods();
  }, [fetchMoods]);

  function pickMood(id) {
    setSelectedMood(id);
    setMood(id);
    setTimeout(() => navigate("/recommendations"), 800); // delay for feedback
  }

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-orange-50 overflow-hidden">
      {/* 🎨 Background abstract shapes */}
      <div className="absolute top-[-5rem] left-[-5rem] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-6rem] right-[-6rem] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            How are you feeling today?
          </h2>
          <p className="mt-3 text-gray-600 text-base sm:text-lg">
            Pick a mood and we’ll suggest destinations tailored just for you ✨
          </p>
        </div>

        {/* Mood Grid */}
        {loading ? (
          <p className="text-gray-500">Loading moods...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : availableMoods.length === 0 ? (
          <p className="text-gray-500">No moods available. Try again later.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {availableMoods.map((m) => {
              const assets = moodAssets[m] || {};
              return (
                <MotionButton
                  key={m}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => pickMood(m)}
                  className={`relative p-6 rounded-2xl shadow-md hover:shadow-2xl border flex flex-col items-center justify-center gap-4 transition-all h-40 text-white overflow-hidden group ${
                    selectedMood === m
                      ? "border-4 border-emerald-400 shadow-xl"
                      : "border-gray-100"
                  }`}
                >
                  {/* Background Image */}
                  {assets.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${assets.image})` }}
                    ></div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

                  {/* Icon + Text */}
                  <motion.div
                    className="relative z-10 flex flex-col items-center gap-2"
                    initial={{ y: 0, opacity: 1 }}
                    whileHover={{ y: -6, opacity: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-3 rounded-full bg-white/80 text-indigo-600 shadow-inner">
                      {assets.icon}
                    </div>
                    <div className="text-lg font-semibold capitalize">{m}</div>
                    <div className="text-xs capitalize">{m} vibes</div>
                  </motion.div>

                  {/* ✅ Checkmark when selected */}
                  {selectedMood === m && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-2 right-2 text-emerald-400 drop-shadow-lg"
                    >
                      <CheckCircle2 size={28} />
                    </motion.div>
                  )}
                </MotionButton>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Don’t worry — you can always change your mood later!
        </div>
      </div>
    </section>
  );
}