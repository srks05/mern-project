import React from 'react';
import { motion } from "framer-motion";

const Footer = () => {

  return (
    <>
     <motion.footer
                              className="py-4 bg-dark text-white text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 1 }}
                          >
                    <div className="container">
                        <p>&copy; 2025 Auction Abode. All rights reserved.</p>
                    </div>
                </motion.footer>
    </>
  );
};

export default Footer;