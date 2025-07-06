import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from "framer-motion";
import FullPageLoader from '../components/FullPageLoader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const Home = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Navbar */}
            <Navbar/>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="py-5 text-center bg-primary text-white">
                <div className="container">
                    <h1 className="display-4 fw-bold">Welcome to Auction Abode</h1>
                    <p className="lead">
                        Revolutionizing property auctions with real-time bidding, AI-driven insights, and secure transactions.
                    </p>
                    {
                        !user && <div className="mt-4">
                        <Link
                            to="/register"
                            className="btn btn-light btn-lg me-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="btn btn-outline-light btn-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Login
                        </Link>
                    </div>
                    }
                   
                </div>
            </motion.section>

            {/* Carousel Section */}
            <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#myCarousel"
                        data-bs-slide-to="0"
                        className=""
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#myCarousel"
                        data-bs-slide-to="1"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#myCarousel"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            className="d-block w-100"
                            alt="Modern Villa"
                            style={{ height: '500px', objectFit: 'cover' }}
                        />
                        <div className="container">
                            <div className="carousel-caption text-start">
                                <h1>Welcome to Auction Abode</h1>
                                <p className="opacity-75">
                                    Revolutionizing property auctions with real-time bidding and AI-driven insights.
                                </p>
                                {
                                    !user &&
                                <p>
                                    <Link className="btn btn-lg btn-primary" to="/register">
                                        Sign Up Today
                                    </Link>
                                </p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item active">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            className="d-block w-100"
                            alt="Luxury Apartment"
                            style={{ height: '500px', objectFit: 'cover' }}
                        />
                        <div className="container">
                            <div className="carousel-caption">
                                <h1>Real-Time Bidding Made Easy</h1>
                                <p>
                                    Experience seamless and transparent bidding with our real-time system powered by WebSockets.
                                </p>
                                {
                                    !user &&
                                <p>
                                    <Link className="btn btn-lg btn-primary" to="/login">
                                        Start Bidding Now
                                    </Link>
                                </p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            className="d-block w-100"
                            alt="Beachfront House"
                            style={{ height: '500px', objectFit: 'cover' }}
                        />
                        <div className="container">
                            <div className="carousel-caption text-end">
                                <h1>AI-Powered Price Suggestions</h1>
                                <p>
                                    Get accurate price predictions for properties using advanced machine learning algorithms.
                                </p>
                                <p>
                                    <a className="btn btn-lg btn-primary" href="/aboutus">
                                        Learn More
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#myCarousel"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#myCarousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Featured Properties Section */}
            <motion.section
                className="py-5"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="container">
                   
                    <h2 className="text-center mb-4">Featured Property Auctions</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {/* Property Card Example */}
                        <motion.div
                            className="col"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <img
                                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    className="card-img-top"
                                    alt="Modern Villa"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Modern Villa in Islamabad</h5>
                                    <p className="card-text">
                                        Located in a prime location with 4 bedrooms, 3 bathrooms, and a spacious garden.
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">Current Bid: $500,000</span>
                                        <Link to="#" className="btn btn-primary btn-sm">
                                            Place Bid
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* Repeat for other properties */}
                        <motion.div
                            className="col"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    className="card-img-top"
                                    alt="Luxury Apartment"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Luxury Apartment in Lahore</h5>
                                    <p className="card-text">
                                        A high-end apartment with modern amenities, located in the heart of Lahore.
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">Current Bid: $300,000</span>
                                        <Link  className="btn btn-primary btn-sm">
                                            Place Bid
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="col"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <img
                                    src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    className="card-img-top"
                                    alt="Beachfront House"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Beachfront House in Karachi</h5>
                                    <p className="card-text">
                                        A stunning beachfront property with breathtaking ocean views.
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">Current Bid: $750,000</span>
                                        <Link  className="btn btn-primary btn-sm">
                                            Place Bid
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Platform Overview Section */}
            <motion.section
                className="py-5 bg-light"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="container">
                    <h2 className="text-center mb-4">Why Choose Auction Abode?</h2>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <i className="bi bi-clock-history display-2 text-primary"></i>
                            <h4>Real-Time Bidding</h4>
                            <p>
                                Experience seamless and transparent bidding with our real-time system powered by WebSockets.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <i className="bi bi-graph-up display-2 text-primary"></i>
                            <h4>AI-Powered Insights</h4>
                            <p>
                                Get accurate price suggestions and automated property verification using AI.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <i className="bi bi-shield-check display-2 text-primary"></i>
                            <h4>Secure Transactions</h4>
                            <p>
                                Ensure safe and secure transactions with advanced fraud prevention mechanisms.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section
                className="py-5"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="container">
                    <h2 className="text-center mb-4">What Our Users Say</h2>
                    <div className="row">
                    <motion.div
                            className="col-md-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">
                                        "Auction Abode made property bidding so easy and transparent. I won my dream home at a great price!"
                                    </p>
                                    <p className="text-muted">- John Doe</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="col-md-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">
                                        "The AI-powered price suggestions helped me make informed decisions. Highly recommend!"
                                    </p>
                                    <p className="text-muted">- Jane Smith</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="col-md-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="card h-100">
                                <div className="card-body">
                                    <p className="card-text">
                                        "The platform is secure and reliable. I felt confident throughout the entire process."
                                    </p>
                                    <p className="text-muted">- Michael Brown</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.section
                className="py-5 bg-light"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="container">
                    <h2 className="text-center mb-4">How It Works</h2>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <i className="bi bi-search display-2 text-primary"></i>
                            <h4>1. Find Properties</h4>
                            <p>
                                Browse through our extensive list of properties and find the one that suits your needs.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <i className="bi bi-cash-coin display-2 text-primary"></i>
                            <h4>2. Place Your Bid</h4>
                            <p>
                                Participate in real-time auctions and place your bids with just a few clicks.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <i className="bi bi-check-circle display-2 text-primary"></i>
                            <h4>3. Win & Secure</h4>
                            <p>
                                If you win, complete the transaction securely and take ownership of your new property.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Call to Action Section */}
             <motion.section
                          className="py-5 bg-primary text-white text-center"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                      >
                <div className="container">
                    <h2 className="mb-4">Ready to Start Bidding?</h2>
                    <p className="lead mb-4">
                        Join Auction Abode today and experience the future of property auctions.
                    </p>
                    {
                        !user &&
                    <Link to="/register" className="btn btn-light btn-lg">
                        Sign Up Now
                    </Link>
                    }
                </div>
            </motion.section>

            {/* Footer Section */}
            <Footer/>
        </motion.div>
    );
};

export default Home;