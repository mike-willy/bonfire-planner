// src/pages/Profile.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function Profile() {
  const { user, trips } = useContext(AppContext); // ✅ user & trips from context
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");

  // ✅ Rewards state
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  const navigate = useNavigate();

  // ✅ Listen to rewards from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPoints(data.points || 0);
        setBadges(data.badges || []);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Upload avatar
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setPhotoURL(downloadURL);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      alert("✅ Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  // ✅ Update display name
  async function handleUpdateName() {
    if (!newName.trim() || !user) {
      setEditingName(false);
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      alert("✅ Name updated successfully!");
    } catch (err) {
      console.error("Name update error:", err);
      alert("❌ Could not update name.");
    } finally {
      setEditingName(false);
    }
  }

  // ✅ Log out
  async function handleLogout() {
    try {
      await signOut(auth);
      alert("✅ Logged out successfully");
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
      alert("❌ Could not log out.");
    }
  }

  if (!user) {
    return (
      <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg text-center">
        <p className="text-gray-600">⚠️ Please log in to view your profile.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-400 text-white text-sm font-medium hover:from-red-600 hover:to-orange-500 transition"
        >
          Log Out
        </button>
      </div>

      {/* Avatar + details */}
      <div className="flex items-center gap-6 mt-6">
        <div className="relative">
          {photoURL ? (
            <img
              src={photoURL}
              alt="User avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-500 text-white text-2xl font-bold">
              {user.displayName?.[0] || "T"}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-indigo-600">
            {uploading ? "..." : "Edit"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        <div>
          {/* Editable Name */}
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              />
              <button
                onClick={handleUpdateName}
                className="px-3 py-1 rounded bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs hover:from-green-600 hover:to-emerald-500"
              >
                Save
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-3 py-1 rounded bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs hover:from-gray-500 hover:to-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">
                {user.displayName || "Traveler"}
              </div>
              <Pencil
                size={16}
                onClick={() => setEditingName(true)}
                className="text-indigo-600 cursor-pointer hover:text-indigo-800"
              />
            </div>
          )}

          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm text-green-600 mt-1">
            Trips Booked: {trips.length}
          </div>

          {/* Rewards summary */}
          <div className="mt-2 text-sm">
            <span className="font-semibold text-indigo-700">🌟 {points} points</span>
            {badges.length > 0 && (
              <span className="ml-3 text-emerald-600">
                🏅 Latest Badge: {badges[badges.length - 1]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3">My Trips</h3>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-sm">No trips booked yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trips.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <div>
                  <div className="font-medium text-indigo-700">
                    {t.destinations.map((d) => d.title).join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t.travelDate
                      ? `Travel Date: ${t.travelDate}`
                      : "No date set"}
                  </div>
                </div>
                <div className="font-semibold text-indigo-600 mt-2">
                  Ksh{t.total}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
