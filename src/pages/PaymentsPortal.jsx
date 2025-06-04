
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Card from '../../Models/Card';
import mongoose from 'mongoose';
import React, { useState, useEffect } from 'react';
const PaymentPortal = () => {
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
   
    amount: '',
    card:'',
    currency: '',
    province: '',
    swiftCode: ''
  });
 

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const res = await axios.post('http://localhost:5000/makepayment', formData);
      alert(res.data.msg);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Payment Failed');
    }
  };
 
 
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
     

      {/* Form Section */}
      <div className="flex-grow flex justify-center items-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Make a Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Currency --</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">-- Select Province --</option>
                <option value="Gauteng">Gauteng</option>
                <option value="Western Cape">Western Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SWIFT Code</label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                required
                pattern="^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>

     
    </div>
  );
};

export default PaymentPortal;
