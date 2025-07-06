import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51Rg94sC4DD8fE1Zzp0zzpMaO8G2wyNrTHCnxIa9uoQayxPAThjgWZrBkhFpGQqOoNDQW5hLmlOmOVEyhhFPd0OFq008W70YR3h');

function StripePaymentForm({ bidId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    // For demo: simulate payment success
    setTimeout(async () => {
      setLoading(false);
      try {
        await axios.post('http://localhost:4646/api/properties/bids/update', {
          bidId,
          isPaid: 1
        });
        setSuccess(true);
        setTimeout(() => {
          if (window.opener) {
            window.opener.location.reload();
          }
          window.close();
          navigate(-1); // fallback if window.close() fails
        }, 5000);
      } catch (err) {
        setError('Failed to update payment status.');
      }
    }, 1500);
    // In production, call backend to create paymentIntent and confirmCardPayment here
  };

  if (success) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-success">Payment received! Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
              <h3 className="mb-4">Pay with Card</h3>
              <CardElement className="form-control mb-3" options={{ style: { base: { fontSize: '16px' } } }} />
              {error && <div className="text-danger mb-3">{error}</div>}
              <button type="submit" className="btn btn-success w-100" disabled={!stripe || loading}>{loading ? 'Processing...' : 'Pay'}</button>
              <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const PaymentPage = () => {
  const { bidId } = useParams();
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm bidId={bidId} />
    </Elements>
  );
};

export default PaymentPage; 