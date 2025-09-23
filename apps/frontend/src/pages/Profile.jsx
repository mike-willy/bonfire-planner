// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut } from "lucide-react";

export default function Profile() {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(auth.currentUser?.displayName || "");

  const navigate = useNavigate();

  // ✅ Fetch trips for this user
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "itineraries"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsData);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Upload avatar
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setPhotoURL(downloadURL);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setUser({ ...auth.currentUser });
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  // ✅ Update display name
  async function handleUpdateName() {
    if (!newName.trim()) {
      setEditingName(false);
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser({ ...auth.currentUser, displayName: newName });
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

  // ✅ Fallback initial
  const initial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : "T";

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium shadow hover:opacity-90 transition"
        >
          <LogOut size={16} />
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
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow">
              {initial}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-indigo-700 shadow">
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
                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded shadow hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs rounded shadow hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">
                {user?.displayName || "Traveler"}
              </div>
              <button
                onClick={() => setEditingName(true)}
                className="text-indigo-600 hover:text-indigo-800 bg-transparent border-none p-0 m-0"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}

          <div className="text-sm text-gray-500">{user?.email}</div>
          <div className="text-sm text-green-600 mt-1">
            Trips Booked: {trips.length}
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg">My Trips</h3>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-sm mt-2">No trips booked yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {trips.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition"
              >
                <div>
                  <div className="font-medium">
                    {t.destinations.map((d) => d.title).join(", ")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t.travelDate || "No date set"}
                  </div>
                </div>
                <div className="font-semibold text-indigo-600">
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
