export default function Community() {
  const posts = [
    {
      id: 1,
      user: "Jane Doe",
      trip: "Romantic Getaway in Naivasha",
      image: "https://source.unsplash.com/collection/190727/800x600",
      likes: 32,
    },
    {
      id: 2,
      user: "Alex Mwangi",
      trip: "Adventure Hike in Mt. Kenya",
      image: "https://source.unsplash.com/collection/888146/800x600",
      likes: 18,
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-2 gap-6">
      {posts.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl shadow p-4">
          <img
            src={p.image}
            alt={p.trip}
            className="rounded-lg h-48 w-full object-cover"
          />
          <div className="mt-3 font-medium">{p.trip}</div>
          <div className="text-xs text-gray-500">by {p.user}</div>
          <div className="text-sm text-gray-600 mt-1">❤️ {p.likes} likes</div>
        </div>
      ))}
    </section>
  );
}
