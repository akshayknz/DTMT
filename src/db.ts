import { collection, getDocs, doc, setDoc, addDoc, getDoc, query, where, documentId, runTransaction, writeBatch, arrayUnion, startAt } from "firebase/firestore";
import { db } from "./firebase/config";
import {
  ElementProps,
  ElementType,
  OrganizationProps,
  PageBodyProps,
  PageProps,
  PageStatus,
  UserOrganizationProps,
  UserPageProps,
  UserProps,
} from "./interfaces/interfaces";
import Login from "./components/Login";
import { store } from "./context/store";
import appSlice, { setCreateOrgName, setNavigateTo } from "./context/appSlice";

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
export const saveUserOrganization = async (): Promise<UserOrganizationProps> => {
  const userId = store.getState().app.userId;
  const name = store.getState().app.createOrgName;
  let id = await saveOrganization({ name: name, access:[userId] } as OrganizationProps)
  let slug = await textToUrl(name, id, "Organizations");
  const orgData = {
    id: id,
    slug: slug,
    owner: userId,
    name: name,
    selected: true,
    status: PageStatus.ACTIVE
  }
  
  let selectedOrganization = await setDoc(
    doc(db, "Users", userId, "Organizations", slug),
    orgData,
    { merge: true }
  );
  setSelectedOrganization(orgData.id, orgData.slug)
  store.dispatch(setNavigateTo(`/dashboard/org/${orgData.slug}`))
  store.dispatch(setCreateOrgName(""))
  return orgData;
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
  let data;
  console.log(slug, userId);
  
  if (docSnap.exists()) {
    await setSelectedOrganization(slug, userId)
    data = docSnap.data();
  } else {
    //The organization: doesnt exist/youre not the owner/not shared to you
    throw new Error("Organizaion doesn't exist or you're not the owner or is not shared to you");
  }

  return data; //ERROR: IF DOCSNAP DOESNT EXIST
};

//GET: get organization ID from SLUG
export const getOrganization = async (slug, userId): Promise<OrganizationProps> => {
  let userOrganization = await getUserOrganization(slug, userId)
  let organizationId = userOrganization.id;
  let docSnap2;
  let data;

  if (organizationId) {
    docSnap2 = await getDoc(doc(db, "Organizations", organizationId));

    data = docSnap2.data();
  } else {
    //The organization: doesnt exist/youre not the owner/not shared to you
  }

  return data;
};

//GET: get list of all Organizations belonging to a user (dashboard)
export const getOrganizations = async (userId): Promise<UserOrganizationProps[]> => {
  const docSnap = await getDocs(query(collection(db, "Users", userId, "Organizations"), where("status", "==", PageStatus.ACTIVE)));
  
  return docSnap.docs.map((v) => v.data()) as UserOrganizationProps[];
};

//PUT: change organization status by slug and userid
export const changeOrganizationStatus = async (slug, userId, status): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Organizations", slug));
  await setDoc(doc(db, "Users", userId, "Organizations", slug), { status: status }, { merge: true });
  await setDoc(doc(db, "Organizations", docSnap.data().id), { status: status }, { merge: true });

  return true;
};

//PUT: change organization status by slug and userid
export const changePageStatus = async (slug, userId, status): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, "Users", userId, "Pages", slug));
  await setDoc(doc(db, "Users", userId, "Pages", slug), { status: status }, { merge: true });
  await setDoc(doc(db, "Pages", docSnap.data().id), { status: status }, { merge: true });

  return true;
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
  
  if (docSnap.exists()) {
    const listOfOrgs = await getDocs(collection(db, "Users", userId, "Organizations"))
    const list = listOfOrgs.docs.map(v => v.id)
    // Get a new write batch
    const batch = writeBatch(db);
    list.forEach(v => {
      const allOrgs = doc(db, "Users", userId, "Organizations", v);
      batch.set(allOrgs, { selected: false }, {merge:true});
    })
    const currentOrg = doc(db, "Users", userId, "Organizations", slug);
    batch.set(currentOrg, { selected: true }, {merge:true});
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
export const savePage = async (data: PageProps, userId: string, orgId: string): Promise<string> => {
  if (!data.id) {//No id passed
    if (!data.name) data.name = "Untitled Page";//No name passed
    data.slug = await textToUrl(data.name, userId, "Pages")
    data.status = PageStatus.ACTIVE
    data.access = [userId]
    data.id = (await addDoc(collection(db, "Pages"), { })).id
    const orgIdFromSlug = await getUserOrganization(orgId, userId)
    await savePageTransaction(data, orgIdFromSlug.id)
    await setDoc(//setDoc to Users collection (saving slug)
      doc(db, "Users", userId, "Pages", data.slug),
      { name: data.name, id: data.id, slug: data.slug, owner: userId }, { merge: true }
    );

    return data.slug;
  } else {
    const orgIdFromSlug = await getUserOrganization(orgId, userId)
    let slug = await savePageTransaction(data, orgIdFromSlug.id)

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
export const savePageTransaction = async (data: PageProps, orgId: string): Promise<string> => {

  const pageDocRef = doc(db, "Pages", data.id);
  const organization = await setDoc(doc(db, "Organizations", orgId), { pages: arrayUnion(data.id) }, { merge: true })
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(pageDocRef);
      if (!sfDoc.exists()) throw "Document does not exist!";
      Object.keys(data.body).forEach((element, i) => {
        transaction.update(doc(db, "Elements", element), { ...data.body[element], order: i });
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

//GET: get all pages belonging to an organization (using the organization's id)
export const getPages = async (orgSlug, userId): Promise<{ [key: string]: PageProps }> => {
  const orgIdDoc = await getUserOrganization(orgSlug, userId)
  const pageIdsDoc = await getDoc(doc(db, "Organizations", orgIdDoc.id))
  const pageIds = pageIdsDoc.data().pages
  let dict: { [key: string]: PageProps } = {};
  // No pages in this organization
  if(!pageIds) return dict 
  // Divide and conquer
  const arrayOf30PagesEach = splitIntoChunks(pageIds, 30);
  const allPages = (await Promise.all(arrayOf30PagesEach.map(async arrayOf30 => {
    const userPages = (await getDocs(query(collection(db, "Pages"), where(documentId(), "in", arrayOf30), where("status", "==", PageStatus.ACTIVE)))).docs.map(v => v.data())
    return userPages
  }))).flat() as PageProps[];
  await allPages.map((doc) => {
      dict[doc.id] = doc as { [key: string]: PageProps };
  });

  return dict;
};

export const getIdFromSlug = async (slug: string, userId: string, type: string): Promise<string> => {
  const querySnapshot = await getDocs(collection(db, "Users", userId, type, slug));

  return ""
}

const splitIntoChunks = (array, chunkSize) => {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}

//POST: save element
export const addEmailToShareList = async (email: string, userId: string, slug: string): Promise<boolean> => {
  // Move user organization to share user
  const querySnapshot = await getDocs(query(collection(db, "Users"), where("email", "==", email)))
  const emailUserId = querySnapshot.docs.map(v => v.data().uid)[0]
  const documentSnapshot = await getDoc(doc(db, "Users", userId, "Organizations", slug))
  const userOrgData = documentSnapshot.data() as OrganizationProps
  // Get all user pages from organization and transfer them to share user's user pages
  const orgData = (await getDoc(doc(db, "Organizations", userOrgData.id))).data() as OrganizationProps
  if(!orgData.pages) return true // no pages in this organization
  /**
   * TODO: Right now if there are no pages in the organization, sharing wont take place.
   * Make it sharable even without any pages!
   */
  // Firebase has a 30 nos limit for in array where operation
  const arrayOf30PagesEach = splitIntoChunks(orgData.pages, 30);
  const allPages = (await Promise.all(arrayOf30PagesEach.map(async arrayOf30 => {
    const userPages = (await getDocs(query(collection(db, "Users", userId, "Pages"), where("id", "in", arrayOf30)))).docs.map(v => v.data())
    return userPages
  }))).flat() as UserPageProps[];
  // Put all the owner user pages into share user user pages
  // Get a new write batch
  const batch = writeBatch(db);
  batch.set(doc(db, "Users", emailUserId, "Organizations", slug), userOrgData)
  batch.set(doc(db, "Organizations", userOrgData.id), {"access":arrayUnion(emailUserId)}, {merge:true})
  allPages.forEach(page=>{
    const shareUserPageRef = doc(db, "Users", emailUserId, "Pages",page.slug);
    batch.set(shareUserPageRef, page);
  })
  // Commit the batch
  await batch.commit();
  // const querySnapshot = await addDoc(collection(db, "Elements"), data);
  return true
};

//GET: Users from Organization
export const getOrganizaionUsers = async (slug, userId) =>{
  const owner = (await getUserOrganization(slug, userId)).owner
  let organizationUsers = ((await getOrganization(slug, userId)).access)
  //TODO
  // Firebase has a 30 nos limit for in array where operation
  const arrayOf30PagesEach = splitIntoChunks(organizationUsers, 30);
  const allPages = (await Promise.all(arrayOf30PagesEach.map(async arrayOf30 => {
    const userPages = (await getDocs(query(collection(db, "Users", userId, "Pages"), where("id", "in", arrayOf30)))).docs.map(v => v.data())
    return userPages
  }))).flat() as UserPageProps[];
}