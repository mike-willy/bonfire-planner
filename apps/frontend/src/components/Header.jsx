import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
            BA
          </div>
          <div>
            <div className="font-semibold">Bonfire Adventures</div>
            <div className="text-xs text-gray-500">Mood-based travel planner</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/auth" className="hover:text-indigo-500">
            Sign Up
          </Link>
          <Link to="/community" className="hover:text-indigo-500">
            Community
          </Link>
          <Link to="/rewards" className="hover:text-indigo-500">
            Rewards
          </Link>
          <Link
            to="/profile"
            className="px-4 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t shadow-md">
          <nav className="flex flex-col gap-3 p-4">
            <Link
              to="/community"
              className="hover:text-indigo-500"
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/rewards"
              className="hover:text-indigo-500"
              onClick={() => setIsOpen(false)}
            >
              Rewards
            </Link>
            <Link
              to="/profile"
              className="px-4 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
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
