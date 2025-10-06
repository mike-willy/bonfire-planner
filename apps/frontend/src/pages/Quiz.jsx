import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Mountain,
  Heart,
  Landmark,
  Users,
  Music,
  TreePine,
} from "lucide-react";

// Motion button
const MotionButton = motion.button;

// Mood → Icons
const moodIcons = {
  relaxed: <Sun className="text-yellow-500" size={22} />,
  adventurous: <Mountain className="text-red-500" size={22} />,
  romantic: <Heart className="text-pink-500" size={22} />,
  cultural: <Landmark className="text-purple-500" size={22} />,
  family: <Users className="text-green-500" size={22} />,
  party: <Music className="text-indigo-500" size={22} />,
  nature: <TreePine className="text-emerald-600" size={22} />,
};

export default function Quiz() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch("http://127.0.0.1:8000/quiz");
        const data = await res.json();
        setQuiz(data.quiz);
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, []);

  async function handleAnswer(mood) {
    const updatedAnswers = [...answers, mood];
    setAnswers(updatedAnswers);

    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      try {
        console.log("👉 Payload being sent:", JSON.stringify({ answers: updatedAnswers }));

        const res = await fetch("http://127.0.0.1:8000/quiz-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: updatedAnswers }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Server responded with error:", errorText);
        }

        const result = await res.json();
        console.log("✅ Response from backend:", result);

        // ✅ Save to localStorage
        localStorage.setItem("mood", result.mood);
        localStorage.setItem("recommendations", JSON.stringify(result.recommendations));
        localStorage.setItem("lastAnswers", JSON.stringify(updatedAnswers)); // 🔑 save answers

        navigate("/recommendations");
      } catch (err) {
        console.error("Error submitting quiz:", err);
      }
    }
  }

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading quiz...</p>;
  }

  if (!quiz.length) {
    return <p className="text-center mt-10 text-red-500">No quiz available.</p>;
  }

  const q = quiz[currentQ];
  const progress = ((currentQ + 1) / quiz.length) * 100;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-orange-50 px-6 py-12">
      {/* Progress Bar */}
      <div className="w-full max-w-3xl h-3 bg-gray-200 rounded-full overflow-hidden mb-10">
        <motion.div
          className="h-3 bg-gradient-to-r from-indigo-500 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQ}
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-2xl w-full text-center border border-indigo-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mb-8">
          {q.question}
        </h2>

        {/* Options */}
        <div className="grid gap-5">
          {q.options.map((opt, i) => (
            <MotionButton
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt.mood)}
              className="w-full px-6 py-5 rounded-xl bg-gradient-to-r from-indigo-100 to-white shadow-md border-2 border-transparent hover:border-indigo-400 hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 bg-white rounded-full shadow-inner">
                  {moodIcons[opt.mood]}
                </span>
                <span className="text-lg text-gray-800 font-semibold">
                  {opt.answer}
                </span>
              </div>
              <span className="text-sm text-indigo-600 font-medium capitalize">
                {opt.mood} vibe
              </span>
            </MotionButton>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-600">
        Question {currentQ + 1} of {quiz.length}
      </p>
    </section>
  );
}
