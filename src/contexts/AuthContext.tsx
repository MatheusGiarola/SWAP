import { createContext, ReactNode, useEffect, useState } from "react";
import nookies, { destroyCookie } from 'nookies'
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile as firebaseUpdateProfile,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';

import { auth, db } from "../services/firebase";
// import useFirebaseAuth, { AuthState } from "../hooks/useFirebaseAuth";
import { api } from "../services/api";
import { doc, getDoc } from "firebase/firestore";

interface User extends FirebaseUser {
    // permissions: string;
    // roles: string[];
}

type AuthContextData = {
    user?: User;
    signInWithGoogle(): Promise<SignInReturn>;
    signInWithEmail(data: SignInCredentials): Promise<SignInReturn>;
    signOut(): Promise<void>;
    updateProfile(data: UpdateProfileData): Promise<void>;
    isAuthenticated(): AuthenticatedReturn;
    isNotAuthenticated(): AuthenticatedReturn;
    isLoading: boolean;
    authState: AuthState;
}

export type AuthState = 'unauthenticated' | 'authenticated' | 'missingInfo'

type SignInCredentials = {
    email: string;
    password: string;
}

type SignInReturn = {
    success: boolean;
    message?: string;
}

type UpdateProfileData = {
    email?: string;
    phoneNumber?: string;
    displayName?: string;
    photoURL?: string;
    // emailVerified: boolean;
    // password: string;
    // disabled: boolean,
}

type AuthenticatedReturn = {
    success: boolean;
    isLoadin?: string;
    redirect?: { path: string };
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


async function isProfileComplete(userID: string) {
    const docRef = doc(db, "user", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log('Profile is complete', { userData: docSnap.data() })

    } else {
        console.log("No such document!");
    }

    return docSnap.exists();
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState<AuthState>('unauthenticated');

    // listen for Firebase state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);

    const authStateChanged = async (userData: User) => {
        setIsLoading(true)

        if (!userData) {
            setAuthState('unauthenticated')
            setUser(null)
            destroyCookie(undefined, process.env.NEXT_PUBLIC_TOKEN_NAME)
        } else {
            const token = await userData.getIdToken();
            nookies.set(undefined, process.env.NEXT_PUBLIC_TOKEN_NAME, token, { path: '/' })

            setUser(userData)

            if (await isProfileComplete(userData.uid)) {
                setAuthState('authenticated')
            } else {
                setAuthState('missingInfo')
            }
        }

        setIsLoading(false)
    };

    async function signOut() {
        try {
            await firebaseSignOut(auth)
        } catch (error) {
            console.log('Error on signOut', error)
        }
    }

    async function signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const user = await signInWithPopup(auth, provider);

            return {
                success: !!user
            }
        } catch (error) {
            let message: string

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    message = 'Pop-up fechado pelo usuário.'
                    break;
                default:
                    message = error.message
            }

            return {
                success: false,
                message: message
            }
        }
    }

    async function signInWithEmail({ email, password }: SignInCredentials) {
        try {
            await signInWithEmailAndPassword(auth, email, password)

            return {
                success: true
            }
        } catch (error) {
            let message: string

            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'Usuário não encontrado.'
                    break;
                case 'auth/wrong-password':
                    message = 'Senha incorreta.'
                    break;
                default:
                    message = error.message
            }

            return {
                success: false,
                message: message
            }
        }
    }

    async function updateProfile(data: UpdateProfileData) {
        try {
            const result = await api.put('user', {
                uid: user.uid,
                data
            })

            if (result.status !== 200) return Promise.reject()

            setUser({ ...user, ...data })
            setAuthState('authenticated')
        } catch (err) {
            return Promise.reject()
        }

        return Promise.resolve()
    }

    function isAuthenticated() {
        let success = false
        let redirect = { path: '' }

        if (!isLoading) {
            if (authState === 'authenticated') {
                success = true
            } else if (authState === 'missingInfo') {
                success = false,
                    redirect.path = '/signUp/completeProfile'
            } else if (authState === 'unauthenticated') {
                success = false,
                    redirect.path = '/signIn'
            }
        }

        return {
            success,
            redirect,
            isLoading,
        }
    }

    function isNotAuthenticated() {
        let success = false
        let redirect = { path: '' }

        if (!isLoading) {
            if (authState === 'authenticated') {
                redirect.path = '/dashboard'
            } else if (authState === 'missingInfo') {
                redirect.path = '/signUp/completeProfile'
            } else if (authState === 'unauthenticated') {
                success = true
            }
        }

        return {
            success,
            redirect,
            isLoading,
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithEmail,
            signOut,
            updateProfile,
            isAuthenticated,
            isNotAuthenticated,
            isLoading,
            authState,
        }}>
            {children}
        </AuthContext.Provider>
    )
}