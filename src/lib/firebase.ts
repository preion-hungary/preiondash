// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "envirodash",
  appId: "1:456872698572:web:b27cc3fad9abe81ffe1869",
  storageBucket: "envirodash.firebasestorage.app",
  apiKey: "AIzaSyDcBDASjNKT1-t7wd2DjXqtgyUvmXL0W3Y",
  authDomain: "envirodash.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "456872698572",
  databaseURL: "https://envirodash-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
