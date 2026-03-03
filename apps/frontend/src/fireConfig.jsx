// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Replace these with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD_RuWyFu2niUtuXmCyouyMF3dAJfpZHK8",
  authDomain: "bonfireplanner.firebaseapp.com",
  projectId: "bonfireplanner",
  storageBucket: "bonfireplanner.firebasestorage.app",
  messagingSenderId: "728582965560",
  appId: "1:728582965560:web:d3011e46345065cc9b19cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
