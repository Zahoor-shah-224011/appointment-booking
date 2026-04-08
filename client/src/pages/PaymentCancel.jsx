import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
  const navigate = useNavigate();
  useEffect(() => {
    toast.error('Payment was cancelled. Please try again.');
    navigate(-1); // go back to doctor page
  }, [navigate]);
  return null;
};
export default PaymentCancel;