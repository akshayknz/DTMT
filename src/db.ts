import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { UserOrganizationProps, UserProps } from "./interfaces/interfaces";

//GET: get all users
export const getUsers = async (): Promise<UserProps[]> => {
    const querySnapshot = await getDocs(collection(db, "Organizations"));

    return querySnapshot.docs.map((doc) => doc.data()) as [UserProps];
};

//POST: save user's displayName, email, photoURL, uid
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

//POST: save organization
export const saveOrganization = async ({ name, id }: UserOrganizationProps): Promise<UserOrganizationProps> => {
    console.log(textToUrl(name, id),id);
    
    const querySnapshot = await addDoc(collection(db, "Organizations"), {
        name: name
      });
    let slug = await textToUrl(name, id);
    const querySnapshot2 = await setDoc(doc(db, "Users", id, "Organizations",slug), {
        name: name,
        id: querySnapshot.id,
        slug: slug
    }, { merge: true });
    console.log(querySnapshot.id, name, id);
    return { name:name,id:id, slug: slug };
};

//FUN: convert text to url
export const textToUrl = async (text:string, id: string) =>{
    text = text.toLowerCase();
    //remove special characters and replace them with hyphens
    text = text.replace(/[^a-z0-9]+/g, '-');
    //remove duplicate hyphens.
    text = text.replace(/--+/g, '-');
    //DB: check for uniqueness
    const querySnapshot = await getDocs(collection(db, "Users", id, "Organizations" ));
    let existingOrganizations = querySnapshot.docs.map((doc) => doc.id); //docIds[]
    if (existingOrganizations.includes(text)) {
        let number = 1;
        let newValue = text + number; 
        while (existingOrganizations.includes(newValue)) { //loop until unique
        newValue = newValue.slice(0, -1) + (number + 1); //remove the previous number
        number++;
        }
        text = newValue;
    }
    //return the final readable URL.
    return text;
}

//GET: get organization ID from SLUG
export const getOrg = async (slug, userId): Promise<string> => {
    const docSnap = await getDoc(doc(db, "Users", userId, "Organizations", slug ));
    if (docSnap.exists()) {
        let orgId = docSnap.data().id;
        const docSnap2 = await getDoc(doc(db, "Organizations", orgId ));

        console.log("lessss",docSnap2.data());
    } else {
    }
    // const querySnapshot = await getDocs(collection(db, "Users", id, "Organizations" ));
    return "yo";
};