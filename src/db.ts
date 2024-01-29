import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import firebase from "firebase/compat/app";


export const getUsers = async (): Promise<any[]> => {
    const querySnapshot = await getDocs(collection(db, "Organizations"));
    
    return querySnapshot.docs.map((doc) => doc.data());
};
type SaveUserProps = {
    displayName: string, email: string, photoURL: string, uid: string
}
export const saveUser = async ({displayName, email, photoURL, uid}): Promise<SaveUserProps> => {
    const docId = doc(collection(db, "Organizations"))
    const querySnapshot = await setDoc(docId, {displayName:displayName, 
        email:email, photoURL: photoURL, uid: uid});
    console.log(querySnapshot, displayName, email, photoURL, uid);
    // return querySnapshot.docs.map((doc) => doc.data());
    return {displayName, email, photoURL, uid};
};