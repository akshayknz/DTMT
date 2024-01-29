import { useContext } from "react";
import { AuthContext } from './context/AuthContext';

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const { userId, status } = useContext(AuthContext)
	return (status === 'authenticated' && userId) ? <Outlet /> : <Navigate to="/login"  replace />;
};

export default ProtectedRoutes;