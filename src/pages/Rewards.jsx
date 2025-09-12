export default function Rewards() {
  const badges = [
    { id: 1, label: "Explorer", desc: "Visited 3+ destinations", earned: true },
    { id: 2, label: "Budget Master", desc: "Planned under $500", earned: false },
    { id: 3, label: "Cultural Seeker", desc: "Took 2+ cultural trips", earned: true },
  ];

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold">Your Rewards</h2>
      <p className="text-sm text-gray-600">Earn badges by traveling and exploring.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-lg border text-center ${
              b.earned ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="text-lg font-semibold">{b.label}</div>
            <div className="text-xs text-gray-500 mt-1">{b.desc}</div>
            <div className="mt-2 text-sm font-medium">
              {b.earned ? "✅ Earned" : "🔒 Locked"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
