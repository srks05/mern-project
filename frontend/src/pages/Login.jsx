import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion"; // Import Framer Motion
import { loginUser } from "../services/authService";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Manage password visibility
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginResponse, setLoginResponse] = useState(null);
  const [otpError, setOtpError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { email, password };
      const response = await loginUser(payload);
      console.log("response is ", response);

      setLoginResponse(response);
      setShowOtpModal(true);
    } catch (err) {
      setError("Invalid password");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === loginResponse.otp.toString()) {
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
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }} 
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
            <h3 className="text-center text-primary fw-bold">Welcome Back!</h3>
            <p className="text-center text-muted">Login to Auction Abode</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label text-muted">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"} 
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <motion.button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)} 
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </motion.button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
            </form>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register" className="text-primary fw-bold">Register</Link>
            </p>
            <p className="text-center">
              <Link to="/" className="text-primary fw-bold">Home</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

     
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

export default Login;
