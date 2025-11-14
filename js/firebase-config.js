import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3Wbfmn9IQCRfAmheglCzL5sSGMfw7sZA",
  authDomain: "e-learn-95a3a.firebaseapp.com",
  projectId: "e-learn-95a3a",
  storageBucket: "e-learn-95a3a.firebasestorage.app",
  messagingSenderId: "81590034772",
  appId: "1:81590034772:web:6d0ffd11feec895e7ba8c1",
  measurementId: "G-L7333G951P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
