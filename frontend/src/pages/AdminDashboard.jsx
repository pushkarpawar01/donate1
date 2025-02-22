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

  const handleApprove = async (ngoId) => {
    const confirmApproval = window.confirm("Are you sure you want to approve this NGO?");
    if (!confirmApproval) return;

    try {
      await axios.post(`http://localhost:5000/admin/approve-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId));
    } catch (error) {
      setError("Failed to approve NGO. Please try again.");
      console.error("Error approving NGO:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
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
                <button onClick={() => handleApprove(ngo._id)}>Approve</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
