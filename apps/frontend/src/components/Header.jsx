import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();

  // ✅ Function to check if link is active
  const isActive = (path) => location.pathname === path;

  const baseLink = "transition-colors duration-200 hover:text-indigo-500";
  const activeLink =
    "text-indigo-600 font-semibold underline underline-offset-4";

  // ✅ Scroll listener for hide/show
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setVisible(false);
      } else {
        // scrolling up → show
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl 
                 px-6 py-3 max-w-5xl w-[95%] transition-all duration-500 
                 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"}`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
            BA
          </div>
          <div>
            <div className="font-semibold">Bonfire Adventures</div>
            <div className="text-xs text-gray-500">
              Mood-based travel planner
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/auth"
            className={`${baseLink} ${isActive("/auth") ? activeLink : ""}`}
          >
            Sign Up
          </Link>
          <Link
            to="/community"
            className={`${baseLink} ${isActive("/community") ? activeLink : ""}`}
          >
            Community
          </Link>
          <Link
            to="/rewards"
            className={`${baseLink} ${isActive("/rewards") ? activeLink : ""}`}
          >
            Rewards
          </Link>
          <Link
            to="/leaderboard"
            className={`${baseLink} ${
              isActive("/leaderboard") ? activeLink : ""
            }`}
          >
            Leaderboard
          </Link>
          <Link
            to="/profile"
            className={`px-4 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 ${
              isActive("/profile")
                ? "border-indigo-500 text-indigo-600 font-semibold"
                : ""
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full mt-2 
                     bg-white/90 backdrop-blur-xl border shadow-lg rounded-2xl p-4"
        >
          <nav className="flex flex-col gap-3">
            <Link
              to="/community"
              className={`${baseLink} ${
                isActive("/community") ? activeLink : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/rewards"
              className={`${baseLink} ${
                isActive("/rewards") ? activeLink : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Rewards
            </Link>
            <Link
              to="/leaderboard"
              className={`${baseLink} ${
                isActive("/leaderboard") ? activeLink : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className={`px-4 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-center ${
                isActive("/profile")
                  ? "border-indigo-500 text-indigo-600 font-semibold"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
