// src/pages/Auth.jsx
import { useState, useContext } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import { AppContext } from "../context/AppContext"; // 👈 get pendingItinerary

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { pendingItinerary, setPendingItinerary } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (isSignUp) {
        // ✅ Sign up
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        if (fullName.trim()) {
          await updateProfile(userCred.user, {
            displayName: fullName,
          });
        }

        alert("✅ Account created! You can now book trips.");
      } else {
        // ✅ Sign in
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Signed in successfully!");
      }

      // ✅ If user had a pending itinerary, send them to checkout
      if (pendingItinerary) {
        setPendingItinerary(null); // clear after use
        navigate("/checkout");
      } else {
        navigate("/itinerary"); // default fallback
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-orange-50 via-white to-indigo-50 p-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full ">
        <h2 className="text-xl font-semibold text-center">
          {isSignUp ? "Create an Account" : "Sign In"}
        </h2>
        <p className="text-sm text-gray-600 text-center mt-1">
          {isSignUp
            ? "Register to start booking trips."
            : "Log in to continue your journey."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-lg w-full text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 px-3 py-2 border rounded-lg w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 px-3 py-2 border rounded-lg w-full text-sm pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-medium hover:from-indigo-600 hover:to-emerald-500 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </section>
  );
}
