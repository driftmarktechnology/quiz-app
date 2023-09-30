import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBU5sC_NGf8BgAwMecJEEyxYPVKOkHI-JE",
  authDomain: "chat-590ba.firebaseapp.com",
  projectId: "chat-590ba",
  storageBucket: "chat-590ba.appspot.com",
  messagingSenderId: "739032611243",
  appId: "1:739032611243:web:d0ed556a78ccf3a9ab7aee",
  databaseURL: Constants.expoConfig.extra.databaseURL,
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
