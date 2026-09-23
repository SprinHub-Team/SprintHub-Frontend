import { useAuthStore } from '../store/authStore';

export function useAuth() {

    const user = useAuthStore(state => state.user);
    const token = useAuthStore(state => state.token);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const setSession = useAuthStore(state => state.setSession);
    const clearSession = useAuthStore(state => state.clearSession);
    
    function logout(){
        clearSession()
    };

    return{
        user, token, isAuthenticated, setSession, clearSession, logout
    };

}