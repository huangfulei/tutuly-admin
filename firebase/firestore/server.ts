import { db } from "../serverApp";

export const getADoc = async (collection: string, id: string) => {
  return await db.collection(collection).doc(id).get();
};

export const getAllDocs = async (collection: string) => {
  return await db.collection(collection).get();
};

export const setDoc = async (
  collection: string,
  data: any,
  id?: string,
  merge?: boolean
) => {
  if (id) {
    return await db.collection(collection).doc(id).set(data, { merge });
  } else {
    return await db.collection(collection).doc().set(data);
  }
};

// export const deleteADoc = async (path: string) => {
//   await deleteDoc(doc(db, path));
// };
