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

const MotionButton = motion.button;

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
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
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

  function selectAnswer(questionId, mood) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: mood,
    }));
  }

  async function handleSubmit() {
    const finalAnswers = Object.values(answers);

    try {
      console.log("👉 Payload being sent:", JSON.stringify({ answers: finalAnswers }));

      const res = await fetch("http://127.0.0.1:8000/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Server responded with error:", errorText);
      }

      const result = await res.json();
      console.log("✅ Response from backend:", result);

      localStorage.setItem("mood", result.mood);
      localStorage.setItem("recommendations", JSON.stringify(result.recommendations));
      localStorage.setItem("lastAnswers", JSON.stringify(finalAnswers));

      navigate("/recommendations");
    } catch (err) {
      console.error("Error submitting quiz:", err);
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

  const hasMinimumAnswers = Object.keys(answers).length >= 3;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-orange-50 px-6 py-12">
      {/* Notice */}
      <div className="mb-6 max-w-2xl text-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg shadow">
        ⚡ Please answer <span className="font-bold">at least 3 questions</span> 
        so we can generate the best recommendations for your vibe.
      </div>

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
              onClick={() => selectAnswer(q.id, opt.mood)}
              className={`w-full px-6 py-5 rounded-xl shadow-md border-2 transition flex items-center justify-between ${
                answers[q.id] === opt.mood
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "bg-gradient-to-r from-indigo-100 to-white border-transparent hover:border-indigo-400 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 bg-white rounded-full shadow-inner">
                  {moodIcons[opt.mood]}
                </span>
                <span
                  className={`text-lg font-semibold ${
                    answers[q.id] === opt.mood ? "text-white" : "text-gray-800"
                  }`}
                >
                  {opt.answer}
                </span>
              </div>
              <span
                className={`text-sm font-medium capitalize ${
                  answers[q.id] === opt.mood ? "text-white" : "text-indigo-600"
                }`}
              >
                {opt.mood} vibe
              </span>
            </MotionButton>
          ))}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ((prev) => prev - 1)}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 
               text-blue-1000 font-medium shadow-md transition-all duration-300 
               hover:from-gray-300 hover:to-gray-700 disabled:opacity-50"
        >
           Previous
        </button>

        {currentQ < quiz.length - 1 ? (
          <button
            onClick={() => setCurrentQ((prev) => prev + 1)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                 text-white font-medium shadow-md transition-all duration-300 
                 hover:from-indigo-600 hover:to-purple-600"
          >
            Next ➡
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!hasMinimumAnswers}
            className={`px-6 py-3 rounded-lg font-medium shadow ${
              hasMinimumAnswers
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            ✅ Confirm & Submit
          </button>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md text-center">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              You have answered {Object.keys(answers).length} questions.  
              Do you want to submit and see your recommendations?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-600">
        Question {currentQ + 1} of {quiz.length}
      </p>
    </section>
  );
}
