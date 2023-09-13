import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    // eslint-disable-next-line no-undef
    apiKey:process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_KEY,
    projectId: process.env.REACT_APP_FIREBASE_KEY,
    storageBucket: process.env.REACT_APP_FIREBASE_KEY,
    messagingSenderId: process.env.REACT_APP_FIREBASE_KEY,
    appId: process.env.REACT_APP_FIREBASE_KEY,
    measurementId: "G-364WP6ZVLD"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);