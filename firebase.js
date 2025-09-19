import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfCwsty9xqWvzfhjsiBe5h2reYO4pRrus",
  authDomain: "digimental-6cfa1.firebaseapp.com",
  projectId: "digimental-6cfa1",
  storageBucket: "digimental-6cfa1.firebasestorage.app",
  messagingSenderId: "396913884896",
  appId: "1:396913884896:web:20db934ce9e79d07411a85",
  measurementId: "G-YTC9DNDB2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export all the necessary services and functions
export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  collection, 
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc, 
  setDoc,
  getDoc
};