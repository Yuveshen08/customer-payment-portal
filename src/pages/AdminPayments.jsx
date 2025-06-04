import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employee/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    try {
      const res = await axios.put(`http://localhost:5000/employee/updatestatus/${id}`, {
        status: action,
        admin: 'Admin'
      });
      alert(res.data.msg);
      fetchPayments(); // Refresh the list
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Payments Dashboard</h1>
      {loading ? (
        <p className="text-center">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow-md">
            <thead className="bg-blue-700 text-white">
              <tr>
               
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Province</th>
                <th className="p-3 text-left">SWIFT</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">{p.currency}</td>
                  <td className="p-3">{p.province}</td>
                  <td className="p-3">{p.swiftCode}</td>
                  <td className="p-3 font-medium">
                    {p.status === 'Approved' && <span className="text-green-600">Approved</span>}
                    {p.status === 'Denied' && <span className="text-red-600">Denied</span>}
                    {(!p.status || p.status === 'Pending') && (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => updateStatus(p._id, 'Approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      disabled={p.status === 'Approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(p._id, 'Denied')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      disabled={p.status === 'Denied'}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
