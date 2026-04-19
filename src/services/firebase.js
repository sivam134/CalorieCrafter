// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnUlvRoap-bpx_5qmcpbUi72Fn2YQdIRA",
  authDomain: "caloriecraftr.firebaseapp.com",
  databaseURL: "https://caloriecraftr-default-rtdb.firebaseio.com",
  projectId: "caloriecraftr",
  storageBucket: "caloriecraftr.firebasestorage.app",
  messagingSenderId: "294555158408",
  appId: "1:294555158408:web:a04e2ea8febb5ebd06dc3d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
