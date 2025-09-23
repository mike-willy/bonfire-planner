// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 👈 add this

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD_RuWyFu2niUtuXmCyouyMF3dAJfpZHK8",
  authDomain: "bonfireplanner.firebaseapp.com",
  projectId: "bonfireplanner",
  storageBucket: "bonfireplanner.appspot.com", // 👈 make sure it's correct
  messagingSenderId: "728582965560",
  appId: "1:728582965560:web:d3011e46345065cc9b19cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // 👈 export storage

export default app;
