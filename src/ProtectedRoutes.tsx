import { useContext } from "react";
import { AuthContext } from './context/AuthContext';

import { Navigate, Outlet } from "react-router-dom";
import Loading from "./components/Loading";

const ProtectedRoutes = () => {
    const { userId, status } = useContext(AuthContext)
    console.log(userId, status);
    
	
    if(status === 'checking') { //loading screen while auth==checking
        return <Loading />;
    }
    if(status === 'authenticated' && userId) { //show contents if auth==authenticated
        return <Outlet />;
    }
    if(!(status === 'authenticated' && userId)) { //navigate to login if auth==not authenticated
        return <Navigate to="/login"  replace />;
    }
};

export default ProtectedRoutes;