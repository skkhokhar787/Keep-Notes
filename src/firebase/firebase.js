// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5rIrGMyM4QyIsmumJcMeJz-Wqa33fdxc",
  authDomain: "keep-notes-df3dd.firebaseapp.com",
  projectId: "keep-notes-df3dd",
  storageBucket: "keep-notes-df3dd.firebasestorage.app",
  messagingSenderId: "886692119962",
  appId: "1:886692119962:web:e8e81fd512dd1bf24b6623",
  measurementId: "G-NKLF8DCQJK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app)
const analytics = getAnalytics(app);