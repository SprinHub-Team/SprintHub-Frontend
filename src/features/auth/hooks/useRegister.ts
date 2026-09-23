import { useState } from "react";
import type { RegisterRequestDto } from "../types/auth.dto";
import { register } from "../services/authService";


export function useRegister(){
    
    const [isLoading, setIsLoading] = useState(false);

    async function executeRegister(data: RegisterRequestDto){

        setIsLoading(true);

        try{

            await register(data);

        }finally {
            setIsLoading(false);
        }
    }

    return{
        executeRegister, isLoading
    };

}