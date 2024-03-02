import { collection, getDocs, doc, setDoc, addDoc, getDoc, query, where, documentId, runTransaction, writeBatch } from "firebase/firestore";
import { db } from "./firebase/config";
import {
  ElementProps,
  ElementType,
  OrganizationProps,
  PageBodyProps,
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
  let selectedOrganization = await setDoc(
    doc(db, "Users", id, "Organizations", slug),
    {
      name: name,
      id: querySnapshotId,
      slug: slug,
      selected: selected,
    },
    { merge: true }
  );
  setSelectedOrganization(id, slug)
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
    await setSelectedOrganization(docSnap.data().id, userId)
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

//GET: get organization ID from SLUG
export const setSelectedOrganization = async (slug, userId): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Organizations", slug));
  let data;
  if (docSnap.exists()) {
    let orgId = docSnap.data().id;
    const listOfOrgs = await getDocs(collection(db, "Users", userId, "Organization"))
    const list = listOfOrgs.docs.map(V => V.id)
    // Get a new write batch
    const batch = writeBatch(db);
    list.forEach(v => {
      const nycRef = doc(db, "Users", userId, "Organization", v);
      batch.set(nycRef, { selected: false });
    })
    const nycRef = doc(db, "Users", userId, "Organization", slug);
    batch.set(nycRef, { selected: true });
    // Commit the batch
    await batch.commit();
  } else {
    return false;
  }
  // const querySnapshot = await getDocs(collection(db, "Users", id, "Organizations" ));
  return true; //ERROR: IF DOCSNAP DOESNT EXIST
};
//POST: Add page
/**
 * POST: Create new page or save existing page (when called with an id in data).
 * (Future TODO: dont send back the entire page data, that is done by getPage.
 * Only send slug back)
 *
 * @param data - All page properties
 * @param userId - The user id to store the slug and document id relationship
 * @returns Slug of the page
 *
 * @beta
 */
export const savePage = async (data: PageProps, userId: string): Promise<string> => {
  if (!data.id) {//No id passed
    if (!data.name) data.name = "Untitled Page";//No name passed
    data.slug = await textToUrl(data.name, userId, "Pages")
    data.status = PageStatus.ACTIVE
    data.id = (await addDoc(collection(db, "Pages"), {})).id
    await savePageTransaction(data)
    await setDoc(//setDoc to Users collection (saving slug)
      doc(db, "Users", userId, "Pages", data.slug),
      { name: data.name, id: data.id, slug: data.slug, },
    );

    return data.slug;
  } else {
    let slug = await savePageTransaction(data)

    return slug;
  }

  return null;
};


//POST: Add page
/**
 * POST: Create new page or save existing page write commit
 *
 * @param data - All page properties (With ID even for new pages)
 * @returns Slug of the page
 *
 * @beta
 */
export const savePageTransaction = async (data: PageProps): Promise<string> => {

  const pageDocRef = doc(db, "Pages", data.id);
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(pageDocRef);
      if (!sfDoc.exists()) throw "Document does not exist!";
      Object.keys(data.body).forEach(element => {
        transaction.update(doc(db, "Elements", element), { ...data.body[element] });
      });
      data.body = Object.keys(data.body)
      transaction.update(pageDocRef, { ...data });
    });
  } catch (e) {
    console.log("Transaction failed: ", e);
  }

  return data.slug;
};


//GET: get page data from SLUG & userId
export const getPage = async (slug, userId): Promise<PageProps> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Pages", slug));
  let pageId = docSnap.data().id;
  let docSnap2, data;
  if (pageId) {
    docSnap2 = await getDoc(doc(db, "Pages", pageId));
    data = docSnap2.data() as PageProps;
    data.id = pageId;
    if (Object.keys(data.body).length != 0) data.body = await getAllElements(data.body)

    return data;
  } else {
    return null;
  }
};

//GET: get element data from elementId
export const getAllElements = async (elements): Promise<PageBodyProps> => {
  if (elements.length > 30) {
    /**
     * Firebase currently do not support where in quries of arrays larger than
     * 30, so after thirty the only way to get this done is to lookup individually.
     * This is only a rough sketch.
     **/
    let pageBody = {} as PageBodyProps;
    await elements.forEach(async id => {
      pageBody[id] = (await getDoc(doc(db, "Elements", id))).data() as ElementProps;
    }); //maybe a for loop

    return pageBody;
  } else {
    const querySnapshot = await getDocs(query(collection(db, "Elements"), where(documentId(), "in", elements)));
    let dict: PageBodyProps = {};
    await querySnapshot.docs.map((doc) => { dict[doc.id] = doc.data() as ElementProps });

    return dict as PageBodyProps;
  }

  return null
};

//POST: save element
export const saveElement = async (data: ElementProps): Promise<string> => {
  const querySnapshot = await addDoc(collection(db, "Elements"), data);
  return querySnapshot.id;
};

//GET: get element data from elementId
export const getPages = async (orgId): Promise<PageBodyProps> => {
  const querySnapshot = await getDocs(query(collection(db, "Elements"), where(documentId(), "in", orgId)));
  let dict: PageBodyProps = {};
  await querySnapshot.docs.map((doc) => { dict[doc.id] = doc.data() as ElementProps });

  return dict as PageBodyProps;
};

export const getIdFromSlug = async (slug: string, userId: string, type: string): Promise<string> => {
  const querySnapshot = await getDocs(collection(db, "Users", userId, type, slug));

  return ""
}