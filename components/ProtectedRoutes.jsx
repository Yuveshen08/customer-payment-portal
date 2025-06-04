import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('tokenAUTH');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.role;

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'customer') {
        navigate('/card-details');
      }
    }
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;
