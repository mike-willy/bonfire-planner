export default function Profile() {
  const trips = [
    { id: 1, name: "Diani Beach Holiday", date: "2024-08-10", cost: 750 },
    { id: 2, name: "Naivasha Romantic Trip", date: "2024-12-05", cost: 420 },
  ];

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/100"
          alt="User avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <div className="font-semibold text-lg">John Traveler</div>
          <div className="text-sm text-gray-500">Points: 1200</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Past Trips</h3>
        <div className="mt-3 space-y-2">
          {trips.map((t) => (
            <div key={t.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.date}</div>
              </div>
              <div className="font-semibold">${t.cost}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
