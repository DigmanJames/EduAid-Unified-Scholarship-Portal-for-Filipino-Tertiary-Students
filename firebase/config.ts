
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// ------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAIiGueB9ZzPvBlcXQrWtSDvj9Nt1zF8TM",
  authDomain: "eduaid-portal.firebaseapp.com",
  projectId: "eduaid-portal",
  storageBucket: "eduaid-portal.firebasestorage.app",
  messagingSenderId: "288175626972",
  appId: "1:288175626972:web:95824a0f22c962d514b219"
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

try {
  // Check if config is valid before initializing
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn("Firebase config is missing. App will run in limited mode.");
  }
} catch (e) {
  console.error("Firebase initialization failed. Please check your config keys.", e);
}

export { app, auth, googleProvider, db, storage };
