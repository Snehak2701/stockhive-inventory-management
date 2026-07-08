import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { environment } from "../../environments/environments";

const app = initializeApp(environment.firebase);

export const auth = getAuth(app);
export const db = getFirestore(app);



const uid = auth.currentUser?.uid;