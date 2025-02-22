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
      setError("Failed to decline NGO. Please try again.");
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
          <ul>
            {ngos.map(ngo => (
              <li key={ngo._id}>
                {ngo.name} - {ngo.email}
                <button className="approve-btn" onClick={() => handleApprove(ngo._id)}>Approve</button>
                <button className="decline-btn" onClick={() => handleDecline(ngo._id)}>Decline</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
