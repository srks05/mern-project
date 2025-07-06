import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Properties from "./pages/Properties";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./context/PrivateRoute";
import AdminProperties from "./pages/AdminProperties";
import AdminUsers from "./pages/AdminUsers";
import PaymentPage from './pages/PaymentPage';

const AnimatedRoutes = () => {
  const location = useLocation(); // Track route changes

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/AdminDashboard" element={
          <PrivateRoute allowedRoles={["Admin"]}>
          <AdminDashboard />
        </PrivateRoute>
          } />
           <Route path="/AdminProperties" element={
          <PrivateRoute allowedRoles={["Admin"]}>
          <AdminProperties />
        </PrivateRoute>
          } />
           <Route path="/AdminUsers" element={
          <PrivateRoute allowedRoles={["Admin"]}>
          <AdminUsers />
        </PrivateRoute>
          } />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/pay/:bidId" element={<PaymentPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default AppRoutes;
