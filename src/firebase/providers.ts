import {
    createUserWithEmailAndPassword, GoogleAuthProvider,
    onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup
} from 'firebase/auth'
import { AuthStateContext } from '../context/AuthContext'
import { FirebaseAuth } from './config'
import { saveUser } from "../db";
interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
  }
const googleProvider = new GoogleAuthProvider()

export const singInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider)

        const { displayName, email, photoURL, uid } = result.user
        saveUser({displayName, email, photoURL, uid});
        return uid

    } catch (e) {
        alert((e as Error).message)
    }
}


interface PropsRegister {
    email: string
    password: string
}

export const signInWithCredentials = async ({ email, password }: PropsRegister) => {

    try {
        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);

        return resp.user.uid

    } catch (e) {
        alert((e as Error).message)
    }

}

export const loginWithCredentials = async ({ email, password }: PropsRegister) => {

    try {
        const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);

        return resp.user.uid

    } catch (e) {

        alert((e as Error).message)
    }
}


type StateDispatch = React.Dispatch<React.SetStateAction<Pick<AuthStateContext, "status" | "userId">>>

export const onAuthStateHasChanged = (setSession: StateDispatch) => {
    onAuthStateChanged(FirebaseAuth, user => {

        if (!user) return setSession({ status: 'no-authenticated', userId: null })

        setSession({ status: 'authenticated', userId: user!.uid })
    })
}

export const logoutFirebase = async () => await FirebaseAuth.signOut()
