import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { UserProps } from "./interfaces/interfaces";

export const getUsers = async (): Promise<UserProps[]> => {
    const querySnapshot = await getDocs(collection(db, "Organizations"));

    return querySnapshot.docs.map((doc) => doc.data()) as [UserProps];
};

export const saveUser = async ({ displayName, email, photoURL, uid }: UserProps): Promise<UserProps> => {
    const querySnapshot = await setDoc(doc(db, "Users", uid), {
        displayName: displayName,
        email: email,
        photoURL: photoURL,
        uid: uid
    }, { merge: true });
    console.log(querySnapshot, displayName, email, photoURL, uid);
    // return querySnapshot.docs.map((doc) => doc.data());
    return { displayName: displayName, email: email, photoURL: photoURL, uid: uid };
};