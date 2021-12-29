import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { db } from "../clientApp";

export const getADoc = async (
  path: string
): Promise<DocumentSnapshot<DocumentData>> => {
  return await getDoc(doc(db, path));
};

export const getAllDocs = async (path: string): Promise<QuerySnapshot<any>> => {
  return await getDocs(collection(db, path));
};

export const setDocWithID = async (
  path: string,
  data: any,
  merge?: boolean
): Promise<void> => {
  return await setDoc(
    doc(db, path),
    { ...data, modifiedTime: serverTimestamp() },
    { merge }
  );
};

export const addDocWithAutoID = async (path: string, data: any) => {
  return await addDoc(collection(db, path), {
    ...data,
    modifiedTime: serverTimestamp(),
  });
};

export const deleteADoc = async (path: string) => {
  await deleteDoc(doc(db, path));
};
