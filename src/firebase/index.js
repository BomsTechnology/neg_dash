import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyA_Q_PIpUegqaerQelAV1_jFKG2TK-5igo",
  authDomain: "neg-auto.firebaseapp.com",
  projectId: "neg-auto",
  storageBucket: "neg-auto.appspot.com",
  messagingSenderId: "427856191522",
  appId: "1:427856191522:web:7a1a93e3fc1d925368aa7b",
};
const initializeFirebase = initializeApp(firebaseConfig);
const db = getFirestore(initializeFirebase);
const storage = getStorage(initializeFirebase);

export { initializeFirebase, db, storage };
