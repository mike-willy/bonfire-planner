import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence} from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import { AppProvider } from "./context/AppContext";

import Landing from "./pages/Landing";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import Itinerary from "./pages/Itinerary";
import Community from "./pages/Community";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";

export default function App() {
  const location = useLocation();

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-orange-50 text-gray-800">
        <Header />

        <main className="flex-1 w-full">
          {/* ✅ AnimatePresence allows exit animations */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
              <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
              <Route path="/recommendations" element={<PageTransition><Recommendations /></PageTransition>} />
              <Route path="/itinerary" element={<PageTransition><Itinerary /></PageTransition>} />
              <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
              <Route path="/rewards" element={<PageTransition><Rewards /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </AppProvider>
  );
}

