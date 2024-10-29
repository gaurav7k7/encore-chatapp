// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCK8GrL2Ms8DbV8F_dbsAvk7s845pjnrKM",
    authDomain: "encore-chatapp.firebaseapp.com",
    databaseURL: "https://encore-chatapp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "encore-chatapp",
    storageBucket: "encore-chatapp.appspot.com",
    messagingSenderId: "739480503934",
    appId: "1:739480503934:web:6f40d97f7c168e0deb3a2f",
    measurementId: "G-9PXLXLJVPV"
};
  


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize analytics if you're using it
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default app;