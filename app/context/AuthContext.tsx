import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {useRouter, useSegments} from "expo-router";
import jwtDecode from "jwt-decode";
import {ObjectId} from "bson";

interface AuthProps {
    authState?: { token: string | null; isAuthenticated: boolean | null }
    onRegister?: (name: string, password: string, age: string, gender: string, profession: string) => Promise<any>;
    onLogin?: (name: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    onTest?: () => Promise<any>;
}

export const TOKEN_KEY = 'jwt';
export const USER_KEY = 'userId';
export const API = 'http://192.168.2.140:8080';
export const AUTH_API = API + '/auth';
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(isAuthenticated: boolean | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to the login page.
            router.replace("/login");
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect away from the login page.
            router.replace("/habits");
        }
    }, [isAuthenticated, segments]);
}

interface MyTokenData {
    sub: string;
    exp: number;
    iat: number;
}

function isTokenExpired(token: string): boolean {
    return jwtDecode<MyTokenData>(token).exp < Date.now() / 1000;
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        isAuthenticated: boolean | null;
    }>({
        token: null,
        isAuthenticated: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const tokenString = await SecureStore.getItemAsync(TOKEN_KEY);

            if (tokenString && !isTokenExpired(tokenString)) {
                // validate jwt in backend
                const token = JSON.parse(tokenString);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    isAuthenticated: true,
                });
            }
        }
        loadToken();
    }, [])

    useProtectedRoute(authState.isAuthenticated)

    const register = async (name: string, password: string, age: string, gender: string, profession: string) => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            axios.defaults.headers.common['Authorization'] = ``;
            return await axios.post(`${AUTH_API}/register`, {name, password, age, gender, profession});
        } catch (e) {
            return e
        }
    }
    const login = async (name: string, password: string) => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            axios.defaults.headers.common['Authorization'] = ``;
            const tokenResult = await axios.post(`${AUTH_API}/login`, {name, password});
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenResult.data.data}`;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokenResult.data.data));

            const userResult = await axios.get(API + '/user/currentUser');
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userResult.data.name))

            if(tokenResult.data.data !== null) {
                setAuthState({
                    token: tokenResult.data.data,
                    isAuthenticated: true,
                });
            }

            return tokenResult;

        } catch (e) {
            return e;
        }
    }
    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            isAuthenticated: null,
        })
    }

    const test = async () => {
        try {
            return await axios.get(`${AUTH_API}/test`);
        } catch (e) {
            console.log("error in test")
            return {error: true, message: (e as any).response.data.message}
        }
    }

    return (
        <AuthContext.Provider
            value={{
                authState,
                onRegister: register,
                onLogin: login,
                onLogout: logout,
                onTest: test
            }}>
            {children}
        </AuthContext.Provider>
    );
}