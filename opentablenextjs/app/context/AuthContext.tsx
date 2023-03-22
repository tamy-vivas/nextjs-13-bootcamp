"use client";
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { createContext, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    phone: string;
};

interface State {
    loading: boolean;
    error: string | null;
    data: User | null
};

interface AuthState extends State {
    setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
    loading: false,
    data: null,
    error: null,
    setAuthState: () => { }
});

const fetchUser = async (setAuthState: React.Dispatch<React.SetStateAction<State>>) => {
    try {
        const jwt = getCookie("jwt");
        if (!jwt) {
            return setAuthState({
                data: null,
                error: null,
                loading: false,
            });
        }

        const response = await await axios.get(`http://localhost:3000/api/auth/me`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        setAuthState({
            data: response.data,
            error: null,
            loading: false,
        });
    } catch (error: any) {
        setAuthState({
            data: null,
            error: error.response.data.errorMessage,
            loading: false,
        });
    }
};

export default function AuthConext({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<State>({
        loading: true,
        data: null,
        error: null,
    });


    useEffect(() => {
        fetchUser(setAuthState);
    }, [])


    return <AuthenticationContext.Provider value={{ ...authState, setAuthState }} >
        {children}
    </AuthenticationContext.Provider>;
}