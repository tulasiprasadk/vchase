import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getDatabase, type Database } from "firebase/database";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig: FirebaseOptions = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyDMsYzau58w43Dja7lJnVyLlN_FFpWnEKs",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "vchase-2025.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "vchase-2025",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "vchase-2025.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "814109434469",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:814109434469:web:74b2831a73009891dedc8c",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-CXJVF8B4CR",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const requiredKeys: Array<keyof FirebaseOptions> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];
const isConfigValid = requiredKeys.every(
  (key) => Boolean(firebaseConfig[key])
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let realtimeDb: Database | null = null;
let analytics: Analytics | null = null;

if (isConfigValid) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    realtimeDb = getDatabase(app);
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "[firebase] Firebase environment variables are missing. " +
      "Set NEXT_PUBLIC_FIREBASE_* values to enable database features."
  );
}

export { app, auth, db, realtimeDb, analytics, firebaseConfig };

export const isFirebaseConfigured = () => Boolean(app);
