import React from 'react'
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
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
          <h1 className="display-4 fw-bold">About Auction Abode</h1>
          <p className="lead">
            Your trusted platform for seamless and secure property auctions.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="py-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container">
          <h2 className="text-center mb-4">Who We Are</h2>
          <p className="text-center">
            Auction Abode is an innovative platform designed to transform the real estate market. We provide a transparent and efficient way to buy and sell properties through real-time auctions.
          </p>
          <div className="row mt-5">
            <motion.div
              className="col-md-4 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-lightning-fill display-2 text-primary"></i>
              <h4 className="mt-3">Fast & Reliable</h4>
              <p>Our platform ensures quick and seamless property transactions.</p>
            </motion.div>
            <motion.div
              className="col-md-4 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-shield-lock-fill display-2 text-primary"></i>
              <h4 className="mt-3">Secure Transactions</h4>
              <p>All auctions are monitored to ensure transparency and safety.</p>
            </motion.div>
            <motion.div
              className="col-md-4 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-people-fill display-2 text-primary"></i>
              <h4 className="mt-3">User-Friendly</h4>
              <p>Designed for both buyers and sellers to have a smooth experience.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Mission */}
      <motion.section
        className="py-5 bg-light"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="container text-center">
          <h2 className="mb-4">Our Mission</h2>
          <p>
            Our mission is to revolutionize the real estate industry by providing a modern and secure online auction platform where buyers and sellers can engage in seamless transactions.
          </p>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-5 bg-primary text-white text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="container">
          <h2 className="mb-4">Join Auction Abode Today!</h2>
          <p className="lead">Start buying and selling properties with confidence.</p>
        </div>
      </motion.section>

      <Footer />
    </motion.div>
    </>
  )
}

export default AboutUs