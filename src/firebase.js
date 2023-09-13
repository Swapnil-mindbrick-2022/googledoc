import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey:process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "doc-3f582.firebaseapp.com",
    projectId: "doc-3f582",
    storageBucket: "doc-3f582.appspot.com",
    messagingSenderId: "240290856618",
    appId: "1:240290856618:web:361f922d449020918a9ad3",
    measurementId: "G-364WP6ZVLD"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);