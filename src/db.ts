import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import firebase from "firebase/compat/app";
import { UserProps } from "./interfaces/interfaces";

export const getUsers = async (): Promise<any[]> => {
    const querySnapshot = await getDocs(collection(db, "Organizations"));
    
    return querySnapshot.docs.map((doc) => doc.data());
};

export const saveUser = async ({displayName, email, photoURL, uid}:UserProps): Promise<UserProps> => {
    const docId = doc(collection(db, "Organizations"))
    const querySnapshot = await setDoc(docId, {displayName:displayName, 
        email:email, photoURL: photoURL, uid: uid});
    console.log(querySnapshot, displayName, email, photoURL, uid);
    // return querySnapshot.docs.map((doc) => doc.data());
    return {displayName:displayName, email:email, photoURL:photoURL, uid:uid};
};