/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    // eslint-disable-next-line no-undef
    apiKey:process.env.REACT_APP_FIREBASE_KEY,
    // eslint-disable-next-line no-undef
    authDomain: process.env.AUTH_DOMAIN,
    // eslint-disable-next-line no-undef
    projectId: process.env.PROJECT_ID,
    // eslint-disable-next-line no-undef
    storageBucket: process.env.STORAGE_BUCKET,
    // eslint-disable-next-line no-undef
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    // eslint-disable-next-line no-undef
    appId: process.env.APP_ID,
    measurementId: process.env.MEASURMENT_ID
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);