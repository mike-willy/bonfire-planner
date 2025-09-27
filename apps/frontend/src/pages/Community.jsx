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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Heart, Share2 } from "lucide-react";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState({}); // track which posts are expanded

  // ✅ Fetch posts in real-time
  useEffect(() => {
    const q = query(
      collection(db, "community_posts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Toggle Like (like/unlike)
  async function handleLike(post) {
    if (!auth.currentUser) {
      alert("⚠️ Please log in to like posts.");
      return;
    }
    try {
      const postRef = doc(db, "community_posts", post.id);
      const userId = auth.currentUser.uid;

      if (post.likedBy?.includes(userId)) {
        // Unlike
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
        });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  // ✅ Helper to toggle "See more"
  function toggleExpand(postId) {
    setExpanded((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  // ✅ Render UI differently per post type
  function renderPostContent(p) {
    const isExpanded = expanded[p.id];
    const maxLength = 80; // characters before showing "See more"
    const needsTruncate = p.title && p.title.length > maxLength;

    const displayText =
      needsTruncate && !isExpanded
        ? p.title.slice(0, maxLength) + "..."
        : p.title;

    switch (p.postType) {
      case "itinerary":
        return (
          <>
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="rounded-lg h-56 w-full object-cover"
              />
            )}
            <h3 className="mt-3 font-semibold text-indigo-700 text-lg">
              ✈️ {displayText || "Untitled Itinerary"}
            </h3>
            {needsTruncate && (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-xs text-indigo-500 hover:underline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <p className="text-sm text-gray-500">by {p.userName}</p>
          </>
        );
      case "badge":
        return (
          <div className="flex flex-col items-center text-center py-8">
            <div className="text-5xl">🏅</div>
            <h3 className="mt-3 font-semibold text-emerald-600 text-lg">
              {p.title || "New Badge"}
            </h3>
            <p className="text-sm text-gray-500">earned by {p.userName}</p>
          </div>
        );
      case "destination":
        return (
          <>
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="rounded-lg h-56 w-full object-cover"
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
            <p className="text-sm text-gray-500">shared by {p.userName}</p>
          </>
        );
      default:
        return (
          <>
            <h3 className="font-semibold text-lg">
              {displayText || "Community Post"}
            </h3>
            {needsTruncate && (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-xs text-indigo-500 hover:underline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
            <p className="text-sm text-gray-500">by {p.userName}</p>
          </>
        );
    }
  }

  return (
    <section className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No community posts yet. 🚀</p>
      ) : (
        posts.map((p) => {
          const userId = auth.currentUser?.uid;
          const liked = p.likedBy?.includes(userId);
          const likeCount = p.likedBy ? p.likedBy.length : 0;

          return (
            <div
              key={p.id}
              className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Content fills space */}
              <div className="flex-1 p-4">{renderPostContent(p)}</div>

              {/* Actions always at bottom */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                {/* Like button */}
                <button
                  onClick={() => handleLike(p)}
                  className={`flex items-center gap-2 transition ${
                    liked
                      ? "text-pink-500 scale-110"
                      : "text-gray-600 hover:text-pink-500"
                  }`}
                  style={{ background: "transparent", border: "none",outline: "none" }}
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
                  style={{ background: "transparent", border: "none",outline: "none" }}
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
