import { collection, getDocs, doc, setDoc, addDoc, getDoc, query, where, documentId } from "firebase/firestore";
import { db } from "./firebase/config";
import {
  ElementProps,
  ElementType,
  OrganizationProps,
  PageProps,
  PageStatus,
  UserOrganizationProps,
  UserProps,
} from "./interfaces/interfaces";

//GET: get user
export const getUser = async (id: string): Promise<UserProps | Error> => {
  const docSnap = await getDoc(doc(db, "Users", id));
  if (docSnap.exists()) {
    return docSnap.data() as UserProps;
  }
  return new Error("not found");
};

//POST: save user's displayName, email, photoURL, uid
export const saveUser = async ({ displayName, email, photoURL, uid }: UserProps): Promise<UserProps> => {
  const querySnapshot = await setDoc(
    doc(db, "Users", uid),
    {
      displayName: displayName,
      email: email,
      photoURL: photoURL,
      uid: uid,
    },
    { merge: true }
  );
  console.log(querySnapshot, displayName, email, photoURL, uid);
  // return querySnapshot.docs.map((doc) => doc.data());
  return { displayName: displayName, email: email, photoURL: photoURL, uid: uid };
};

//POST: save user organization
//Each call will create a document in (db,Users,userId,type) path.
export const saveUserOrganization = async ({
  name,
  id,
  selected,
}: UserOrganizationProps): Promise<UserOrganizationProps> => {
  const querySnapshotId = await saveOrganization({ name: name }); //TODO: Elaborate
  let slug = await textToUrl(name, id, "Organizations");
  await setDoc(
    doc(db, "Users", id, "Organizations", slug),
    {
      name: name,
      id: querySnapshotId,
      slug: slug,
      selected: selected,
    },
    { merge: true }
  );
  console.log(querySnapshotId, name, id);
  return { name: name, id: id, slug: slug, selected: selected };
};

//POST: save organization
export const saveOrganization = async (data: OrganizationProps): Promise<string> => {
  const querySnapshot = await addDoc(collection(db, "Organizations"), data);
  return querySnapshot.id;
};

/**
 * Convert text to URL. Generate slug from the name of page/organization.
 * This will be unique in the provided `type` collection.
 *
 * @param text - The text to be made into slug (usually title of item)
 * @param userId - The user id to store the slug and document id relationship
 * @param type - The type of item. Currently its "Organizations"/"Pages". Value used as docRef path to store this info.
 * @returns The generated slug
 *
 * @beta
 */
export const textToUrl = async (text: string, userId: string, type: string) => {
  text = text.toLowerCase();
  //remove special characters and replace them with hyphens
  text = text.replace(/[^a-z0-9]+/g, "-");
  //remove duplicate hyphens.
  text = text.replace(/--+/g, "-");
  //DB: check for uniqueness
  const querySnapshot = await getDocs(collection(db, "Users", userId, type));
  let existingOrganizations = querySnapshot.docs.map((doc) => doc.id); //docIds[]
  if (existingOrganizations.includes(text)) {
    //check if text already exists in type
    let number = 1;
    let newValue = text + number; //if yes, add a number next to it to make it unique
    while (existingOrganizations.includes(newValue)) {
      //still text exists in type, so loop until unique
      //remove the previous number and add the new number
      newValue = newValue.slice(0, -1) + (number + 1);
      number++;
    }
    text = newValue;
  }

  return text; //return the final readable URL.
};

//GET: get organization ID from SLUG
export const getUserOrganization = async (slug, userId): Promise<UserOrganizationProps> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Organizations", slug));
  let docSnap2;
  let data;
  if (docSnap.exists()) {
    let orgId = docSnap.data().id;
    data = docSnap.data();
  } else {
  }
  // const querySnapshot = await getDocs(collection(db, "Users", id, "Organizations" ));
  return data; //ERROR: IF DOCSNAP DOESNT EXIST
};

//GET: get organization ID from SLUG
export const getOrganization = async (slug, userId): Promise<OrganizationProps> => {
  let organizationId = (await getUserOrganization(slug, userId)).id;
  let docSnap2;
  let data;
  console.log("organizationId", organizationId);
  
  if (organizationId) {
    docSnap2 = await getDoc(doc(db, "Organizations", organizationId));
    data = docSnap2.data();
  }

  return data;
};

//GET: get last selected organization (selected: true)
export const getLastSelectedOrganization = async (userId): Promise<string> => {
  const querySnapshot = await getDocs(
    query(collection(db, "Users", userId, "Organizations"), where("selected", "==", true))
  );
  let data = querySnapshot.docs.map((doc) => doc.data()) as UserOrganizationProps[];

  return data.length > 0 ? (Object.keys(data).length > 0 ? data[0].slug : null) : null;
};

//POST: Add page
/**
 * POST: Create new page or save existing page (when called with an id in data).
 * (Future TODO: dont send back the entire page data, that is done by getPage.
 * Only send slug back)
 *
 * @param data - All page properties
 * @param userId - The user id to store the slug and document id relationship
 * @returns The generated page data 
 *
 * @beta
 */
export const savePage = async (data: PageProps, userId: string): Promise<string> => {
  let d: PageProps = {};
  //No id passed
  if (!data.id) { 
    //No name passed
    if (!data.name) data.name = "Untitled Page"; 
    //new page data
    d = { 
      name: data.name, status: PageStatus.ACTIVE, body: data.body ? data.body : [], 
      slug: await textToUrl(data.name, userId, "Pages"),
    };
    const querySnapshot = await addDoc(collection(db, "Pages"), d);
    getBody(d.body); //TODO: Elaborate into type: { [key: string]: string }
    //setDoc to Users collection (saving slug)
    await setDoc(
      doc(db, "Users", userId, "Pages", d.slug),
      {name: d.name,id: querySnapshot.id,slug: d.slug,},
      { merge: true }
    );
  } else {
    //id is passed and will use setDoc
    const docRef = doc(db, "Pages", data.id);
    await setDoc(docRef, data, { merge: true });
  }

  return d.slug;
};

//GET: get all the body elements
export const getBody = async (ids: string[]): Promise<ElementProps[]> => {
  const querySnapshot = await getDocs(query(collection(db, "Elements"), where(documentId(), "in", ids)));
  let dict: { [key: string]: string } = {};
  const data = querySnapshot.docs.map((doc) => {
    console.log(doc.id);
    return doc.data() as ElementProps;
  });
  let dataa: ElementProps = {
    body: "yo",
    order: 1,
    status: "",
    type: ElementType.LINK,
    userId: "",
  };

  return data;
};

//GET: get page ID from SLUG
export const getPage = async (slug, userId): Promise<PageProps> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Pages", slug));
  let pageId = docSnap.data().id;
  let docSnap2, data;
  if (pageId) {
    docSnap2 = await getDoc(doc(db, "Pages", pageId));
    data = docSnap2.data();
    data.id = pageId;
  }

  return data;
};

//POST: save element
export const saveElement = async (data: ElementProps): Promise<string> => {
  const querySnapshot = await addDoc(collection(db, "Elements"), data);
  return querySnapshot.id;
};
