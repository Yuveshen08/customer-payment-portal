import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CardDetails = () => {
  const navigate = useNavigate();

  const [cardData, setCardData] = useState({
    cardholder: '',
    cardnumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('tokenAUTH');
      const decoded = token ? jwtDecode(token) : null;
      const userlog = decoded?.username || '';

      const payload = { ...cardData, userlog };

      const res = await axios.post('http://localhost:5000/card', payload);

      if (res.status === 200) {
        navigate('/paymentportal'); // ✅ Proper redirect
      }
    } catch (err) {
   
      alert(err.response?.data?.msg || 'Failed to submit card details');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Enter Card Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cardholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              name="cardholder"
              value={cardData.cardholder}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              name="cardnumber"
              value={cardData.cardnumber}
              onChange={handleChange}
              required
              maxLength={19}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Expiry and CVV */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                name="expiry"
                value={cardData.expiry}
                onChange={handleChange}
                required
                maxLength={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                required
                maxLength={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardDetails;
