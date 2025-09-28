// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD14sVVm4jWOQaTUuAvyfYS1FXIVxkxbDc",
  authDomain: "chatroom-ac0b7.firebaseapp.com",
  projectId: "chatroom-ac0b7",
  storageBucket: "chatroom-ac0b7.firebasestorage.app",
  messagingSenderId: "452472655575",
  appId: "1:452472655575:web:e09647918f92726d936a92"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

// Firestore
export const db = getFirestore(app);