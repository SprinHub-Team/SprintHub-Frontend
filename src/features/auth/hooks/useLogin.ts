import { useState } from "react";
import { useAuthStore } from "../store/authStore"
import type { LoginRequestDto } from "../types/auth.dto";
import { login } from "../services/authService";


export function useLogin(){

    const setSession = useAuthStore(state => state.setSession);

    const [isLoading, setIsloading] = useState(false);

    async function executeLogin(data: LoginRequestDto){

        setIsloading(true);

        try{
            const session = await login(data);

            setSession(session);

            return session;
        }finally{
            setIsloading(false);
        }

    }

    return{executeLogin, isLoading};
    
}