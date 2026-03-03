// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { auth, storage, db } from "../fireConfig.jsx";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Pencil, Trophy, Plane, UserCircle } from "lucide-react";

export default function Profile() {
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(auth.currentUser?.displayName || "");

  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [trips, setTrips] = useState([]);

  const [activeTab, setActiveTab] = useState("info");

  const navigate = useNavigate();

  // ✅ Rewards listener
  useEffect(() => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPoints(data.points || 0);
        setBadges(data.badges || []);
      }
    });
  }, []);

  // ✅ Trips listener
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "itineraries"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setTrips(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // ✅ Upload avatar
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;
    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      alert("✅ Profile picture updated!");
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  // ✅ Update display name
  async function handleUpdateName() {
    if (!newName.trim() || !auth.currentUser) {
      setEditingName(false);
      return;
    }
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      alert("✅ Name updated successfully!");
    } catch (err) {
      console.error("Name update error:", err);
    } finally {
      setEditingName(false);
    }
  }

  // ✅ Log out
  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  if (!auth.currentUser) {
    return (
      <section className="mt-8 bg-white rounded-2xl p-6 shadow-lg text-center">
        <p className="text-gray-600">⚠️ Please log in to view your profile.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 bg-gradient-to-b from-orange-50 via-white to-indigo-50 rounded-2xl p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-700">My Profile</h2>
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-sm font-semibold hover:scale-105 transition"
        >
          Log Out
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6 mt-8">
        <div className="relative">
          {photoURL ? (
            <img
              src={photoURL}
              alt="User avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-300 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-indigo-500 text-white text-3xl font-bold shadow-md">
              {auth.currentUser.displayName?.[0] || "T"}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-indigo-700 shadow">
            {uploading ? "..." : "✎"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        <div>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm shadow-sm"
              />
              <button
                onClick={handleUpdateName}
                className="px-4 py-1 rounded-full bg-green-500 text-white text-xs hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-4 py-1 rounded-full bg-gray-400 text-white text-xs hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-xl">
                {auth.currentUser.displayName || "Traveler"}
              </div>
              <Pencil
                size={18}
                onClick={() => setEditingName(true)}
                className="text-indigo-600 cursor-pointer hover:text-indigo-800"
              />
            </div>
          )}
          <div className="text-sm text-gray-500">{auth.currentUser.email}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-4">
        {[
          { id: "info", label: "Info", icon: UserCircle },
          { id: "trips", label: "Trips", icon: Plane },
          { id: "rewards", label: "Rewards", icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition shadow-sm ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white scale-105"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "info" && (
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-700">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-700">
                {auth.currentUser.displayName || "Traveler"}
              </span>
              !
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Manage your profile info, trips, and rewards in one place.
            </p>
          </div>
        )}

        {activeTab === "trips" && (
          <div>
            <h3 className="font-semibold text-lg mb-3">My Trips</h3>
            {trips.length === 0 ? (
              <p className="text-gray-500 text-sm">No trips booked yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col justify-between border rounded-xl p-4 shadow hover:shadow-md transition bg-white"
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
        )}

        {activeTab === "rewards" && (
          <div>
            <h3 className="font-semibold text-lg mb-3">My Rewards</h3>
            <p className="text-indigo-700 font-semibold text-lg">
              🌟 {points} points
            </p>
            {badges.length === 0 ? (
              <p className="text-gray-500 text-sm mt-2">No badges earned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-3">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    🏅 {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
