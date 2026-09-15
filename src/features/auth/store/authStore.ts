import { create } from "zustand";
import { authSessionSchema } from "../types/auth.schema";
import { type AuthSession, type User } from "../types/auth.schema";

const AUTH_STORAGE_KEY = 'sprinthub_auth';

interface AuthState{
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    setSession: (session: AuthSession) => void;
    clearSession: () => void;
}

function getStorageSession(): AuthSession | null{

    const storedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if(!storedSession){
        return null;
    }

    try{

    const parsedSession: unknown = JSON.parse(storedSession);

    const validation = authSessionSchema.safeParse(parsedSession);

    if(!validation.success){
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }

    return validation.data;

    }catch{
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }

}

const storedSession = getStorageSession();

export const useAuthStore = create<AuthState>((set)=>({

    user: storedSession?.user ?? null,
    token: storedSession?.token ?? null,
    isAuthenticated: storedSession !== null,

    setSession: (session: AuthSession) =>{

        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

        set({
            user: session.user,
            token: session.token,
            isAuthenticated: true
        });

    },

    clearSession: ()=>{

        sessionStorage.removeItem(AUTH_STORAGE_KEY);

        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    }

}));