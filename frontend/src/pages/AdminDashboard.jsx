import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnapprovedNGOs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/ngos");
        setNgos(response.data);
      } catch (error) {
        setError("Failed to fetch NGOs. Please try again.");
        console.error("Error fetching NGOs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnapprovedNGOs();
  }, []);

  // Approve NGO
  const handleApprove = async (ngoId) => {
    const confirmApproval = window.confirm("Are you sure you want to approve this NGO?");
    if (!confirmApproval) return;

    try {
      await axios.post(`http://localhost:5000/admin/approve-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId)); // Remove approved NGO from the list
    } catch (error) {
      setError("Failed to approve NGO. Please try again.");
      console.error("Error approving NGO:", error);
    }
  };

  // Decline NGO
  const handleDecline = async (ngoId) => {
    const confirmDecline = window.confirm("Are you sure you want to decline this NGO?");
    if (!confirmDecline) return;

    try {
      await axios.post(`http://localhost:5000/admin/decline-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId)); // Remove declined NGO from the list
    } catch (error) {
      setError("Removed");
      console.error("Error declining NGO:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <br /><br /><br /><br />
      <div className='approval-div'>
        <h1>Admin Dashboard</h1>
        <h2>Pending NGOs for Approval</h2>

        {loading ? (
          <p>Loading NGOs...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : ngos.length === 0 ? (
          <p>No pending NGO approvals.</p>
        ) : (
          <table className="ngo-table" border="1" cellSpacing="0" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid black' }}>Name</th>
                <th style={{ border: '1px solid black' }}>Email</th>
                <th style={{ border: '1px solid black' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngos.map(ngo => (
                <tr key={ngo._id}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{ngo.name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{ngo.email}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <button className="approve-btn" onClick={() => handleApprove(ngo._id)}>Approve</button>
                    <button className="decline-btn" onClick={() => handleDecline(ngo._id)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
