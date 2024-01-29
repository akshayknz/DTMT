import React, { useContext } from "react";
import { AuthContext, AuthProvider } from './context/authContext';

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const { userId, handleLogOut, status } = useContext(AuthContext)
	return (status === 'authenticated' && userId) ? <Outlet /> : <Navigate to="/login"  replace />;
};

export default ProtectedRoutes;