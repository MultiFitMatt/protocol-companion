// src/Context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Subscription plan types
export type Plan = "free" | "pro" | "clinic";

// Stripe subscription status types
export type SubscriptionStatus = 
  | "active" 
  | "canceled" 
  | "incomplete" 
  | "incomplete_expired" 
  | "past_due" 
  | "trialing" 
  | "unpaid" 
  | null;

// User profile stored in Firestore
export interface UserProfile {
  email: string;
  displayName: string | null;
  plan: Plan;
  // Stripe fields (populated by webhooks later)
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: SubscriptionStatus;
  // Timestamps
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  plan: Plan;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? null);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUserProfile(profile);
          setPlan(profile.plan || "free");
        } else {
          // New user - create initial profile
          const newProfile: UserProfile = {
            email: firebaseUser.email ?? "",
            displayName: firebaseUser.displayName ?? null,
            plan: "free",
            stripeCustomerId: null,
            subscriptionId: null,
            subscriptionStatus: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
          setPlan("free");
        }
      } else {
        setUserProfile(null);
        setPlan("free");
      }
      
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", cred.user.uid);
    
    const newProfile: UserProfile = {
      email,
      displayName: null,
      plan: "free",
      stripeCustomerId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, plan, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
