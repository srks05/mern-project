import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(AuthContext);
    console.log(allowedRoles,user.role)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
      }


  return children;
};

export default PrivateRoute;
