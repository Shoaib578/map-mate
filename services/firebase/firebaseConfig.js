// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC92d6_H-dszQn8rpGAxtoCj4e1wIeiUjo",
  authDomain: "map-mate-e3881.firebaseapp.com",
  projectId: "map-mate-e3881",
  storageBucket: "map-mate-e3881.firebasestorage.app",
  messagingSenderId: "108686313980",
  appId: "1:108686313980:web:15a03e8902b8060adc4a79",
  measurementId: "G-HHQZEC7K07"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth };