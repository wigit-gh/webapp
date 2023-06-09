// sign in context provider
"use client";

import { useState, createContext, useContext, Dispatch, SetStateAction } from 'react';

interface SignInContextProps {
    jwt: string | null;
    setJwt: Dispatch<SetStateAction<any>>;
    role: string | null;
    setRole: Dispatch<SetStateAction<any>>;
    isSignedIn: boolean | null;
    setIsSignedIn: Dispatch<SetStateAction<any>>;
    user: object;
    setUser: any;
}

export const SignInContext = createContext<SignInContextProps>({
    jwt: 'not authorized',
    setJwt: (): string => '',
    role: 'customer',
    setRole: (): string => '',
    isSignedIn: false,
    setIsSignedIn: (): boolean => false,
    user: {},
    setUser: ():any => {}
});

export const SignInContextProvider = ( { children } : { children: React.ReactNode}) => {
    const [ jwt, setJwt ] = useState('not authorized');
    const [ role, setRole ] = useState('Guest');
    const [ isSignedIn, setIsSignedIn ] = useState(false);
    const [ user, setUser ] = useState({});

     return (
        <SignInContext.Provider value={{jwt, setJwt, role, setRole, isSignedIn, setIsSignedIn, user, setUser}}>
            { children }
        </SignInContext.Provider>
    );
};

export const useSignInContext = () => useContext(SignInContext);
