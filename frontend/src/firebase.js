import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsB1iitOEJl9_95lfdpU4jHNi4eS4VCvs",
  authDomain: "projecthub-28b52.firebaseapp.com",
  projectId: "projecthub-28b52",
  storageBucket: "projecthub-28b52.appspot.com",
  messagingSenderId: "810956090127",
  appId: "1:810956090127:web:c42e239ee518b89f1bec7a",
  measurementId: "G-BF9LZW2GDY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
