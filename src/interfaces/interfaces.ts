import { User } from "firebase/auth"; //type User import
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName: string;
}

//IAuth context
export interface IAuth {
  user: User | null; //type User comes from firebase
  loading: boolean;
  SignIn: (creds: LoginFormValues) => void;
  SignUp: (creds: UserFormValues) => void;
  SignOut: () => void;
}

export interface UserProps {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export interface UserOrganizationProps {
  name: string;
  id: string;
  slug?: string;
  status: PageStatus;
  owner?: string;
  selected: boolean;
  // This should be in OrganizationProps sharedWith?: string[] // array of user ids
}
export interface UserPageProps {
  name?: string;
  id?: string;
  slug?: string;
  status?: PageStatus;
  owner?: string
  // This should be in PageProps sharedWith?: string[] // array of user ids
}

export interface OrganizationProps {
  name?: string;
  id?: string;
  collections?: string[]; //collection order is with the collection
  pages?: string[]; //collection order is with the collection
  overviewOptions?: string[]; //{clock:[a,b,c,d]; blockcollection:[today,high priority,reminders,todo]}
  access?: string[]
}

export enum PageStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  ARCHIVED = "ARCHIVED",
}

export interface PageProps {
  name?: string;
  id?: string; //not saved as a field in db, just for internal operations
  body?: string[] | PageBodyProps;
  status?: PageStatus;
  slug?: string;
  access?: string[]
}

export interface PageBodyProps { 
  [key: string]: ElementProps 
}

export enum ElementType {
  LINK = "LINK",
  TODO = "TODO",
  TEXT = "TEXT",
}

export interface ElementProps {
  body: TodoProps[] | LinkProps[] | string; //each array element is an object and is a link or a todo
  order: number;
  status: string;
  type: ElementType;
  userId: string;
  orgId: string;
  pageId: string;
}

export enum TodoStatus {
  COMPLETED = "COMPLETED",
  INCOMPLETE = "INCOMPLETE",
}

export interface TodoProps {
  title: string;
  description: string;
  date: Date;
  status: TodoStatus;
}

export interface LinkProps {
  title: string;
  url: string;
  img: string;
}

export interface APIConnectionProps {
  id?: string;
  name: string;
  endpoint: string;
  body: string;
  take:string;
}