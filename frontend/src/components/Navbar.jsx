import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <motion.nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Auction Abode 🏡
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Common routes for all users */}
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              {/* Admin-only routes */}
              {user.role === 'Admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/AdminDashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/AdminUsers">
                      AdminUsers
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/AdminProperties">
                      AdminProperties
                    </Link>
                  </li>
                </>
              )}

              {/* Seller-only route */}
              {user.role === 'Seller' && (
               <li className="nav-item">
               <Link className="nav-link" to="/properties">
                 Properties
               </Link>
             </li>
              )}

              {/* Buyer-only route */}
              {user.role === 'Buyer' && (
               <li className="nav-item">
               <Link className="nav-link" to="/properties">
                 Properties
               </Link>
             </li>
              )}

              {/* Routes for logged-in users */}
              {user.role ? (
                <>
                  

                  {/* Profile Dropdown */}
                  <li className="nav-item dropdown">
                    <motion.a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      id="profileDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                        alt="User Avatar"
                        className="rounded-circle me-2"
                        style={{ width: "35px", height: "35px" }}
                      />
                      {user.username}
                    </motion.a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/changepassword">
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-danger"
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  {/* Routes for non-logged-in users */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/aboutus">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contactus">
                      Contact Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
