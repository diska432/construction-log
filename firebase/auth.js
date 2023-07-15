/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true
})

export default function userFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    const clear = () => {
        setAuthUser(null);
        setisLoading(false);
    }

    const authStateChanged = async(user) => {
        setisLoading(true);

        if(!user) {
            clear();
            return;
        }
        setAuthUser({
            uid: user.uid,
            email: user.email
        })
        setisLoading(false);
    }

    const signOut = () => authSignOut(auth).then(clear);

    useEffect(() => {
        const unsunbscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsunbscribe();
    }, [])

    return {
        authUser,
        isLoading,
        signOut
    }
    
}

export function AuthUserProvider({children}){
    const auth = userFirebaseAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}

export const useAuth = () => useContext(AuthUserContext);