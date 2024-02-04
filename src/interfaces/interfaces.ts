import { User } from 'firebase/auth'; //type User import
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
    user: User | null;  //type User comes from firebase
    loading: boolean;
    SignIn: (creds: LoginFormValues) => void;
    SignUp: (creds: UserFormValues) => void;
    SignOut: () => void;
}

export interface UserProps {
    displayName: string,
    email: string,
    photoURL: string,
    uid: string
}

export interface UserOrganizationProps {
    name: string;
    id: string;
    slug? :string;
}