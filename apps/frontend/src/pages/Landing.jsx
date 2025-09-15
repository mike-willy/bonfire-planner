import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="flex-1 flex items-center justify-center w-full bg-gradient-to-b from-indigo-50 via-white to-orange-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto items-center w-full">
        
        {/* Left Side */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Plan trips that match how you feel
          </h1>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
            Take a short mood quiz and get personalized destinations, itineraries, and rewards.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/quiz"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 text-white font-medium shadow-lg hover:scale-[1.02] transition-transform text-center"
            >
              Plan My Trip Based On My Mood
            </Link>

            <Link
              to="/recommendations"
              className="px-6 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-center"
            >
              Explore Destinations
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative mt-8 md:mt-0">
          <img
            src="/Images/Diani.jpg"
            alt="Diani Beach"
            className="rounded-xl shadow-md w-full object-cover h-64 sm:h-80 md:h-[28rem]"
          />
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-lg p-3 text-left">
            <div className="text-sm font-medium">Featured: Diani Beach</div>
            <div className="text-xs text-gray-600">Beaches · Sunsets · Relax</div>
          </div>
        </div>
      </div>
    </section>
  );
}
