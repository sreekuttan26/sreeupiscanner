// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA54DTD-GYKpkke2Pow85E1A_svzk85lF0",
  authDomain: "sreespends.firebaseapp.com",
  projectId: "sreespends",
  storageBucket: "sreespends.firebasestorage.app",
  messagingSenderId: "174616017090",
  appId: "1:174616017090:web:fdf9297df125f6b320235b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);