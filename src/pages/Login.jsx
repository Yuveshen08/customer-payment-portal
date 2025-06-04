import React, { useState } from 'react';
import axios from 'axios';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/login', credentials);

      sessionStorage.setItem("tokenAUTH",res.data.tokenAUTH)
     navigate('/card-details');
    } catch (err) {
      console.log(err.response?.data?.error)
      setError(err.response?.data?.error?.text ||err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign in to your account</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute top-3.5 left-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2.5 rounded-md font-semibold hover:bg-green-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-green-600 hover:underline">Register here</a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
