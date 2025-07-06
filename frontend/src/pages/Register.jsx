import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";
const Register = () => {
  const { login } = useContext(AuthContext);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginResponse, setLoginResponse] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Seller",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      let payload={username:userData.name,email:userData.email, password:userData.password,role:userData.role}
      const response = await registerUser(payload);
        // Store response and show OTP modal
        setLoginResponse(response);
        setShowOtpModal(true);
        //login(response);
        //navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed, please try again.");
    }
  };
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === loginResponse.otp.toString()) {
      // OTP is correct, proceed with login
      login(loginResponse);
      navigate("/");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };
  return (
    <>
    <motion.div
      className="d-flex align-items-center justify-content-center min-vh-100 bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
          <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
      <motion.div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "12px" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h3 className="text-center text-primary fw-bold">Join Auction Abode</h3>
        <p className="text-center text-muted">Create your account</p>

        {error && (
          <motion.div
            className="alert alert-danger"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="mb-3">
              <label className="form-label text-muted">Select Account Type</label>
              <div>
                <label className="form-check-label me-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="Seller"
                    checked={userData.role === "Seller"}
                    onChange={handleChange}
                  />
                  Seller
                </label>
                <label className="form-check-label me-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="Buyer"
                    checked={userData.role === "Buyer"}
                    onChange={handleChange}
                  />
                  Buyer
                </label>
              </div>
            </div>
          <div className="mb-3">
            <label className="form-label text-muted">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label text-muted">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
              <motion.button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? "🙈" : "👁"}
              </motion.button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Animated Register Button */}
          <motion.button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-bold">Login</Link>
        </p>
         <p className="text-center">
                    <Link to="/" className="text-primary fw-bold">Home</Link>
                  </p>
        </motion.div>
      </motion.div>
    </motion.div>
          {/* OTP Modal */}
          {showOtpModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter OTP</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp("");
                    setOtpError("");
                    setLoginResponse(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please enter the 5-digit OTP sent to your email.</p>
                {otpError && <div className="alert alert-danger">{otpError}</div>}
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg text-center"
                      placeholder="00000"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,5}$/.test(value)) {
                          setOtp(value);
                          setOtpError("");
                        }
                      }}
                      maxLength="5"
                      style={{ fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowOtpModal(false);
                        setOtp("");
                        setOtpError("");
                        setLoginResponse(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
       
        </div>
      )}
    </>
  );
};

export default Register;