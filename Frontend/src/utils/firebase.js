import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCw_zzJyiM_Ecj_f-aisdUkuJ61J87rrTg",
  authDomain: "litrary-hub.firebaseapp.com",
  databaseURL: "https://litrary-hub-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "litrary-hub",
  storageBucket: "litrary-hub.appspot.com",
  messagingSenderId: "894903805473",
  appId: "1:894903805473:web:685945c6ec6a8a628da560",
  measurementId: "G-DFQK86VJXR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);