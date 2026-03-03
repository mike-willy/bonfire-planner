// src/pages/Community.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../fireConfig.jsx";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Heart, Share2 } from "lucide-react";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState({}); // track expanded posts

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

  // ✅ Toggle Like
  async function handleLike(post) {
    if (!auth.currentUser) {
      alert("⚠️ Please log in to like posts.");
      return;
    }
    try {
      const postRef = doc(db, "community_posts", post.id);
      const userId = auth.currentUser.uid;

      if (post.likedBy?.includes(userId)) {
        await updateDoc(postRef, { likedBy: arrayRemove(userId) }); // Unlike
      } else {
        await updateDoc(postRef, { likedBy: arrayUnion(userId) }); // Like
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  // ✅ Expand/collapse long text
  function toggleExpand(postId) {
    setExpanded((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  // ✅ Post Renderer
  function renderPostContent(p) {
    const isExpanded = expanded[p.id];
    const maxLength = 90;
    const needsTruncate = p.title && p.title.length > maxLength;

    const displayText =
      needsTruncate && !isExpanded ? p.title.slice(0, maxLength) + "..." : p.title;

    switch (p.postType) {
      case "itinerary":
        return (
          <div>
            {p.image && (
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="rounded-xl h-48 w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
                  <h3 className="text-white font-semibold text-lg">
                    ✈️ {displayText || "Itinerary"}
                  </h3>
                </div>
              </div>
            )}
            {needsTruncate && (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-xs text-indigo-500 hover:underline mt-2"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <p className="text-sm text-gray-500 mt-2">by {p.userName}</p>
          </div>
        );
      case "badge":
        return (
          <div className="flex flex-col items-center text-center py-6 bg-gradient-to-b from-emerald-50 to-white rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 shadow-md">
              <span className="text-4xl">🏅</span>
            </div>
            <h3 className="mt-3 font-semibold text-emerald-700 text-lg">
              {p.title || "New Badge"}
            </h3>
            <p className="text-sm text-gray-500">earned by {p.userName}</p>
          </div>
        );
      case "destination":
        return (
          <div>
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="rounded-xl h-48 w-full object-cover"
              />
            )}
            <h3 className="mt-3 font-semibold text-orange-600 text-lg">
              📍 {displayText || "Destination"}
            </h3>
            {needsTruncate && (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-xs text-indigo-500 hover:underline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <p className="text-sm text-gray-500 mt-1">shared by {p.userName}</p>
          </div>
        );
      default:
        return (
          <div>
            <h3 className="font-semibold text-lg">{displayText || "Community Post"}</h3>
            {needsTruncate && (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-xs text-indigo-500 hover:underline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <p className="text-sm text-gray-500 mt-1">by {p.userName}</p>
          </div>
        );
    }
  }

  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No community posts yet. 🚀</p>
      ) : (
        posts.map((p) => {
          const userId = auth.currentUser?.uid;
          const liked = p.likedBy?.includes(userId);
          const likeCount = p.likedBy ? p.likedBy.length : 0;

          return (
            <div
              key={p.id}
              className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Post Content */}
              <div className="flex-1 p-5">{renderPostContent(p)}</div>

              {/* Actions */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
                {/* Like button */}
                <button
                  onClick={() => handleLike(p)}
                  className={`flex items-center gap-2 transition ${
                    liked
                      ? "text-pink-500 scale-110"
                      : "text-gray-600 hover:text-pink-500"
                  }`}
                  style={{ background: "transparent", border: "none", outline: "none" }}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      liked ? "fill-pink-500 text-pink-500" : ""
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                  </span>
                </button>

                {/* Share button */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/community/${p.id}`;
                    if (navigator.share) {
                      navigator.share({
                        title: p.title,
                        text: "Check this out on Bonfire Adventures 🚀",
                        url: shareUrl,
                      });
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                      alert("🔗 Link copied to clipboard!");
                    }
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition"
                  style={{ background: "transparent", border: "none", outline: "none" }}
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
