import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCkb2IPZmkDrSGGLyvL1_NzG1se1Hr_wtM",
  authDomain: "protocol-prod.firebaseapp.com",
  projectId: "protocol-prod",
  storageBucket: "protocol-prod.firebasestorage.app",
  messagingSenderId: "844751296214",
  appId: "1:844751296214:web:d3ea9e0579812c946a9b77",
  measurementId: "G-634368MDJM"
};

// Avoid re-initializing in dev / HMR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export { app };
