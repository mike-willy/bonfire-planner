// src/pages/Community.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

export default function Community() {
  const [posts, setPosts] = useState([]);

  // ✅ Fetch posts in real-time
  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Like a post
  async function handleLike(postId) {
    if (!auth.currentUser) {
      alert("⚠️ Please log in to like posts.");
      return;
    }
    try {
      const postRef = doc(db, "community_posts", postId);
      await updateDoc(postRef, {
        likes: increment(1),
      });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  }

  // ✅ Render post card based on type
  function renderPost(p) {
    return (
      <div
        key={p.id}
        className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition"
      >
        {p.imageUrl && (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="rounded-lg h-48 w-full object-cover"
          />
        )}
        <div className="mt-3 font-medium">{p.title || "Untitled"}</div>
        <div className="text-xs text-gray-500">by {p.authorName || "Anonymous"}</div>
        <div className="text-xs text-gray-400">
          {p.createdAt?.toDate().toLocaleDateString()}
        </div>

        {p.type === "badge" && (
          <div className="text-xs text-indigo-600 mt-2">
            🏅 Earned Badge: {p.description}
          </div>
        )}
        {p.type === "itinerary" && (
          <div className="text-xs text-emerald-600 mt-2">
            ✈️ Shared an itinerary with {p.description}
          </div>
        )}
        {p.type === "destination" && (
          <div className="text-xs text-orange-600 mt-2">
            🌍 Recommended destination: {p.description}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => handleLike(p.id)}
            className="text-sm text-indigo-600 hover:underline"
          >
            ❤️ {p.likes || 0} Likes
          </button>
          <button className="text-xs text-gray-500 hover:underline">
            Share
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No community posts yet. 🚀</p>
      ) : (
        posts.map((p) => renderPost(p))
      )}
    </section>
  );
}
