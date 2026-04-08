// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/adimContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { axios } = useAdmin();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      toast.error('Invalid payment session');
      navigate('/');
      return;
    }

    const confirmPayment = async () => {
      try {
        const { data } = await axios.post('/api/payments/confirm-payment', {
          session_id: sessionId,
        }, { withCredentials: true }); // still send credentials in case cookie exists

        if (data.success) {
          toast.success('Payment successful! Your appointment is confirmed.');
          // Navigate to my appointments after a short delay
          setTimeout(() => navigate('/my-appointments'), 2000);
        } else {
          toast.error(data.message || 'Payment confirmation failed');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        toast.error(error.response?.data?.message || 'Payment confirmation failed');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate, axios]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <>
            <h1 className="text-2xl font-semibold mb-4">Confirming your payment...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-green-600">Redirecting...</h1>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;