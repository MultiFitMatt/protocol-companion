// src/lib/protocolStore.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const saveProtocol = async (userId: string, data: any) => {
  const ref = doc(collection(db, "protocols"));
  await setDoc(ref, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const logDose = async (userId: string, protocolId: string, data: any) => {
  return addDoc(collection(db, "doses"), {
    userId,
    protocolId,
    ...data,
    takenAt: data.takenAt ?? serverTimestamp(),
  });
};

export const fetchUserProtocols = async (userId: string) => {
  const q = query(collection(db, "protocols"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};