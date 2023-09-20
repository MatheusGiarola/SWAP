import { useState, useEffect } from 'react'
import nookies, { destroyCookie } from 'nookies'
import { User, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../services/firebase';
import { useToast } from '@chakra-ui/react';

export type AuthState = 'unauthenticated' | 'authenticated' | 'missingInfo'


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

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState<AuthState>('unauthenticated');

    const authStateChanged = async (user: User) => {
        setIsLoading(() => true)
        
        if (!user) {
            setAuthState('unauthenticated')
            setAuthUser(null)
            destroyCookie(undefined, process.env.NEXT_PUBLIC_TOKEN_NAME)
        } else {
            const token = await user.getIdToken();
            nookies.set(undefined, process.env.NEXT_PUBLIC_TOKEN_NAME, token, { path: '/' })
            
            setAuthUser(user)
            
            
            if (await isProfileComplete(user.uid)) {
                setAuthState('authenticated')
            } else {
                setAuthState('missingInfo')
            }
        }
        
        setIsLoading(() => false)
    };

    // listen for Firebase state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        authState,
    };
}