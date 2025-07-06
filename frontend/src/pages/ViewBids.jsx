import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Rg94sC4DD8fE1Zzp0zzpMaO8G2wyNrTHCnxIa9uoQayxPAThjgWZrBkhFpGQqOoNDQW5hLmlOmOVEyhhFPd0OFq008W70YR3h');

const ViewBids = ({ property }) => {
  console.log(property)
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!property?.endBiddingTime) return 0;
    const endTime = new Date(property.endBiddingTime);
    const now = new Date();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  });
  const [newBidAmount, setNewBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(15 * 60); // 15 minutes in seconds
  const paymentTimerRef = useRef();
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [paymentTimerActive, setPaymentTimerActive] = useState(false);

  // Memoize fetchBids to prevent unnecessary re-renders
  const fetchBids = useCallback(async () => {
    if (!property?._id) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:4646/api/properties/${property._id}/bids`);
      setBids(response.data);
      console.warn(response.data)
      console.warn("-----------")

    } catch (error) {
      console.error("Error fetching bids:", error);
      setBidError("Failed to fetch bids. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [property?._id]);

  
  useEffect(() => {
    const newSocket = io("http://localhost:4646", {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Fetch bids only once on mount
  useEffect(() => {
    if (property?._id) {
      fetchBids();
    }
  }, [fetchBids, property?._id]);

  // Listen for bid updates
  useEffect(() => {
    if (socket && property?._id) {
      socket.on("bidUpdate", (data) => {
        if (data.propertyId === property._id) {
          fetchBids();
        }
      });

      return () => {
        socket.off("bidUpdate");
      };
    }
  }, [socket, property?._id, fetchBids]);

  // Update time remaining more efficiently
  useEffect(() => {
    if (!property?.endBiddingTime) return;

    const updateTime = () => {
      const endTime = new Date(property.endBiddingTime);
      const now = new Date();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [property?.endBiddingTime]);

  // Start/reset timer when modal is shown
  useEffect(() => {
    if (showPaymentModal) {
      setPaymentTimer(1 * 60);
      paymentTimerRef.current = setInterval(() => {
        setPaymentTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(paymentTimerRef.current);
    }
    return () => clearInterval(paymentTimerRef.current);
  }, [showPaymentModal]);

  // When timer hits zero, delete all bids and close modal
  useEffect(() => {
    if (paymentTimer === 0) {
      console.log("Payment timer hit zero");
      /*
      // Call API to delete all bids for this property
      axios.delete(`http://localhost:4646/api/properties/${property._id}/bids`)
        .then(() => {
          alert('Time expired. All bids have been deleted.');
          setShowPaymentModal(false);
          window.location.reload();
        })
        .catch(() => {
          alert('Failed to delete bids.');
          setShowPaymentModal(false);
          window.location.reload();
        });
        */
    }
  }, [paymentTimer, property._id]);

  // Find the winning bid and winning buyer
  const winningBid = bids.length > 0 ? bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, bids[0]) : null;
  const isWinningBuyer = winningBid && winningBid.buyer?._id === user?._id;
  const isPaymentDue = winningBid && winningBid.isPaid !== 1;

  // Start payment timer only for winning buyer after auction ends and if payment is due
  useEffect(() => {
    if (timeLeft === 0 && isWinningBuyer && isPaymentDue && !paymentTimerActive) {
      setPaymentTimer(15 * 60);
      setPaymentTimerActive(true);
    }
    // Reset timer if not winning buyer or payment is made
    if ((!isWinningBuyer || !isPaymentDue || timeLeft > 0) && paymentTimerActive) {
      setPaymentTimerActive(false);
      setPaymentTimer(15 * 60);
    }
  }, [timeLeft, isWinningBuyer, isPaymentDue, paymentTimerActive]);

  // Payment timer interval logic
  useEffect(() => {
    let interval = null;
    if (paymentTimerActive && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => prev - 1);
      }, 1000);
    } else if (!paymentTimerActive || paymentTimer <= 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [paymentTimerActive, paymentTimer]);

  const calculateTimeElapsed = (time) => {
    const currentTime = new Date();
    const bidTime = new Date(time);
    const timeDiff = currentTime - bidTime;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m ago`;
  };

  const formatCountdown = (seconds) => {
    if (seconds <= 0){
      return "Auction Ended";
    } 

    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const highestBid = bids.length > 0 ? Math.max(...bids.map((bid) => bid.amount)) : 0;
  const currentPrice = highestBid > 0 ? highestBid : property?.price || 0;
  const bidProgress = ((currentPrice - (property?.price || 0)) / ((property?.price || 0) * 0.2)) * 100;

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");

    if (!newBidAmount || isNaN(newBidAmount) || parseFloat(newBidAmount) <= 0) {
      setBidError("Please enter a valid bid amount");
      return;
    }

    if (parseFloat(newBidAmount) <= currentPrice) {
      setBidError(`Your bid must be higher than ${currentPrice} PKR`);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4646/api/properties/${property._id}/bids`, {
        amount: parseFloat(newBidAmount),
        buyer: user._id,
        property: property._id
      });

      if (response.data) {
        socket.emit("placeBid", {
          propertyId: property._id,
          bidId: response.data._id,
          amount: parseFloat(newBidAmount),
          buyer: user._id
        });

        setNewBidAmount("");
        fetchBids();
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      setBidError(error.response?.data?.message || "Failed to place bid. Please try again.");
    }
  };

  const isAuctionActive = () => {
    if (!property?.startBiddingTime || !property?.endBiddingTime) return false;
    const now = new Date();
    const startTime = new Date(property.startBiddingTime);
    const endTime = new Date(property.endBiddingTime);
    return now >= startTime && now <= endTime;
  };

  const canPlaceBid = user?.role === "Buyer" && isAuctionActive();

  const auctionStatus = () => {
    if (timeLeft <= 0) return "Ended";
    const now = new Date();
    const startTime = new Date(property?.startBiddingTime);
    return now < startTime ? "Not Started" : "Active";
  };

  const handleCardChange = e => setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  const handleCardSubmit = e => {
    e.preventDefault();
    setShowPaymentModal(false);
    axios.post(`http://localhost:4646/api/properties/bids/update`, {
      bidId: selectedBidId,
      isPaid: 1
    });
    alert(`Payment received`);
    // refesh page
    window.location.reload();
  };

  const formatPaymentTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  function StripePaymentForm({ onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      if (!stripe || !elements) {
        setLoading(false);
        return;
      }
      // For demo: simulate payment success
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 1500);
      // In production, call backend to create paymentIntent and confirmCardPayment here
    };

    return (
      <form className="modal-content" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title">Enter Card Details</h5>
          <button type="button" className="btn-close" onClick={onCancel}></button>
        </div>
        <div className="modal-body">
          <CardElement className="form-control mb-2" options={{ style: { base: { fontSize: '16px' } } }} />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-success" disabled={!stripe || loading}>{loading ? 'Processing...' : 'Pay'}</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        </div>
      </form>
    );
  }

  if (!property) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading property details...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading bids...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <div id={`carousell${property._id}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img
                      src={'http://localhost:4646/' + image}
                      className="d-block w-100"
                      alt={`Property ${index + 1}`}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                    className="d-block w-100"
                    alt="No Image"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
            {property.images && property.images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target={`#carousell${property._id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#carousell${property._id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <h4>{property.type} in {property.city}, {property.province}</h4>
          <div className="d-flex gap-2 mb-2">
            <span className="badge bg-primary">{property.noOfBedroom} Beds</span>
            <span className="badge bg-secondary">{property.noOfBathroom} Baths</span>
            <span className="badge bg-success">{property.size} Area Size(Marla)</span>
          </div>
          <p className="text-muted">{property.location}</p>
          <p>Auction Status: <strong className={auctionStatus() === "Active" ? "text-success" : "text-danger"}>{auctionStatus()}</strong></p>
          <p className="text-muted">Start: {new Date(property.startBiddingTime).toLocaleString()}</p>
          <p className="text-muted">End: {new Date(property.endBiddingTime).toLocaleString()}</p>
          {paymentTimerActive && timeLeft === 0 && isWinningBuyer && isPaymentDue && (
            <div className="alert alert-warning text-center mb-3">
              <div>You have 15 minutes to complete your payment.</div>
              Payment window: <strong>{formatPaymentTimer(paymentTimer)}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-light p-3">
            <h5>Starting Price</h5>
            <p className="h4">{property.price} PKR</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light p-3">
            <h5>Current Price</h5>
            <p className="h4">{currentPrice} PKR</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light p-3">
            <h5>Time Remaining</h5>
            <p className="h4">{formatCountdown(timeLeft)}</p>
          </div>
        </div>
      </div>

      {user?.role === "Buyer" && canPlaceBid && (
        <div className="card mb-4 p-3">
          <h5 className="mb-3">Place Your Bid</h5>
          <div className="row">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">PKR</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder={`Minimum bid ${currentPrice + 1} PKR`}
                  value={newBidAmount}
                  onChange={(e) => setNewBidAmount(e.target.value)}
                />
              </div>
              {bidError && <div className="text-danger small mt-1">{bidError}</div>}
            </div>
            <div className="col-md-4">
              <motion.button
                className="btn btn-primary w-100"
                onClick={handlePlaceBid}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Place Bid
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {!isAuctionActive() && (
        <div className="alert alert-info">
          {new Date() < new Date(property.startBiddingTime) 
            ? "Auction has not started yet" 
            : "Auction has ended"}
        </div>
      )}

      <div className="mb-4">
        <h5>Bid Progress</h5>
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${Math.min(100, bidProgress)}%` }}
            aria-valuenow={bidProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(bidProgress)}% to target
          </div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span>Starting: {property.price} PKR</span>
          <span>Target: {property.price * 1.2} PKR</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Bid History</h5>
          <span className="badge bg-primary">{bids.length} bids</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Amount (PKR)</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.length > 0 ? (
                bids
                  .sort((a, b) => b.amount - a.amount)
                  .map((bid) => (
                    <tr key={bid._id} className={bid.amount === highestBid ? "table-success" : ""}>
                      <td>{bid.buyer?.username || 'Unknown'}</td>
                      <td>{bid.amount.toLocaleString()}</td>
                      <td>{calculateTimeElapsed(bid.timestamp)}</td>
                      <td>
                        {bid.amount === highestBid ? (
                          <div>
                            <span className="badge bg-success">Winning</span>
                            {(auctionStatus() != "Active" && bid.buyer?._id==user?._id && bid?.isPaid!=1) ?
                            <button
                              className="btn btn-primary ms-2"
                              onClick={() => window.open(`/pay/${bid._id}`, '_blank')}
                            >
                              Payment
                            </button>
                            : 
                            <></>
                            }
                          </div>
                        ) : (
                          <span className="badge bg-secondary">Outbid</span>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No bids placed yet. Be the first to bid!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {highestBid > 0 && (
        <div className={`alert ${auctionStatus() === "Active" ? "alert-warning" : "alert-success"}`}>
          {auctionStatus() === "Active" ? (
            <>Current highest bid: <strong>{highestBid.toLocaleString()} PKR</strong> by {bids.find((bid) => bid.amount === highestBid)?.buyer?.username || 'Unknown'}</>
          ) : (
            <>Auction won by <strong>{bids.find((bid) => bid.amount === highestBid)?.buyer?.username || 'Unknown'}</strong> for {highestBid.toLocaleString()} PKR</>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBids;