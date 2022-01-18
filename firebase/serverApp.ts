import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCIno14q2G5CN5slM86pmmCUnIr9coBdxI",
  authDomain: "tutuly-6acc2.firebaseapp.com",
  projectId: "tutuly-6acc2",
  storageBucket: "tutuly-6acc2.appspot.com",
  messagingSenderId: "584942139746",
  appId: "1:584942139746:web:bf0d73a9a200e86109d43b",
  measurementId: "G-FPX6Q2DD4F",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
