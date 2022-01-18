import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { db } from "../clientApp";

export const getADoc = async (
  path: string
): Promise<DocumentSnapshot<DocumentData>> => {
  return await getDoc(doc(db, path));
};

export const getAllDocs = async (path: string) => {
  return await getDocs(collection(db, path));
};

export const setDocWithID = async (
  path: string,
  data: any,
  merge?: boolean
): Promise<void> => {
  return await setDoc(doc(db, path), data, { merge });
};

export const addDocWithAutoID = async (path: string, data: any) => {
  return await addDoc(collection(db, path), data);
};

export const deleteADoc = async (path: string) => {
  await deleteDoc(doc(db, path));
};
