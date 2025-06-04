import './App.css';
import Login from './pages/Login';
// import Register from './pages/register';
import PaymentPortal from './pages/PaymentsPortal';
import CardDetails from './pages/CardDetails';
import Admin from './pages/AdminPayments';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from '../components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Make login the landing page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/card-details" element={<ProtectedRoutes><CardDetails /></ProtectedRoutes>} />
        <Route path="/paymentportal" element={<PaymentPortal />} />
        <Route path="/admin" element={<ProtectedRoutes><Admin /></ProtectedRoutes>} />
      </Routes>
    </Router>
  );
}

export default App;
