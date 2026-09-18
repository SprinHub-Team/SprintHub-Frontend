import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";


function PublicRoute(){

    const { isAuthenticated } = useAuth();
    
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />;

}

export default PublicRoute;