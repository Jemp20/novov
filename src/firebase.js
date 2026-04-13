import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtwsOYjEdZgo5s3AgNkL2aKEr3GwCE7O4",
  authDomain: "novov-8118e.firebaseapp.com",
  projectId: "novov-8118e",
  storageBucket: "novov-8118e.firebasestorage.app",
  messagingSenderId: "181510002984",
  appId: "1:181510002984:web:5bc8605ebb2fe5bbd5581d",
  measurementId: "G-0JHXQ521FC"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);