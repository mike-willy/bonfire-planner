import { useContext,useState} from "react";
import { useNavigate } from "react-router-dom";
import { Sun, MapPin, Heart, Star, GlassWater, Users, Music, TreePine,CheckCircle2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const MotionButton = motion.button;

const moods = [
  { id: "relaxed", label: "Relaxed", icon: <Sun size={22} />,image: "/Images/moods/Relaxed.jpg", },
  { id: "adventurous", label: "Adventurous", icon: <MapPin size={22} />,image: "/Images/moods/Adventurous.jpg", },
  { id: "romantic", label: "Romantic", icon: <Heart size={22} />,image: "/Images/moods/Romantic.jpeg", },
  { id: "cultural", label: "Cultural", icon: <Star size={22} />,image: "/Images/moods/Cultural.jpeg", },
  { id: "family", label: "Family", icon: <Users size={22} /> ,image: "/Images/moods/Family.jpeg",},
  { id: "party", label: "Party", icon: <Music size={22} />,image: "/Images/moods/party.webp", },
  { id: "nature", label: "Nature", icon: <TreePine size={22} /> ,image: "/Images/moods/Nature.jpg",},
];

export default function Quiz() {
  const navigate = useNavigate();
  const { setMood } = useContext(AppContext);
  const [selectedMood, setSelectedMood] = useState(null);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {moods.map((m) => (
            <MotionButton
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => pickMood(m.id)}
              className={`relative p-6 rounded-2xl shadow-md hover:shadow-2xl border flex flex-col items-center justify-center gap-4 transition-all h-40 text-white overflow-hidden group ${
                selectedMood === m.id
                  ? "border-4 border-emerald-400 shadow-xl"
                  : "border-gray-100"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${m.image})` }}
              ></div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

              {/* Icon + Text with Framer Motion */}
              <motion.div
                className="relative z-10 flex flex-col items-center gap-2"
                initial={{ y: 0, opacity: 1 }}
                whileHover={{ y: -6, opacity: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 rounded-full bg-white/80 text-indigo-600 shadow-inner">
                  {m.icon}
                </div>
                <div className="text-lg font-semibold">{m.label}</div>
                <div className="text-xs">{m.label} vibes</div>
              </motion.div>

              {/* ✅ Checkmark when selected */}
              {selectedMood === m.id && (
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
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Don’t worry — you can always change your mood later!
        </div>
      </div>
    </section>
  );
}