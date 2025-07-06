import React, { useState,useContext, useEffect} from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthContext from "../context/AuthContext";
import {changePasswordasync } from "../services/authService";
import { useNavigate } from "react-router-dom";
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      return;
    }
    try {
        let payload={userId:user._id,newPassword:formData.newPassword}
        console.log("Password Changed:", payload);
        let res=await changePasswordasync(payload);
        setMessage({ type: "success", text: "Password changed successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);

        navigate("/");
      } catch (err) {
        setMessage(err.message || "Password change failed, please try again.");
      }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
     
      <Navbar />

   
      <motion.section
        className="py-5 text-center bg-dark text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Change Password</h1>
          <p className="lead">Ensure your account security by updating your password.</p>
        </div>
      </motion.section>

     
      <motion.section
        className="py-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              {message.text && (
                <motion.div
                  className={`alert ${
                    message.type === "success" ? "alert-success" : "alert-danger"
                  } text-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {message.text}
                </motion.div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="btn btn-primary w-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update Password
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      
      <Footer />
    </motion.div>
  );
};

export default ChangePassword;
