// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    // Fetch unapproved NGOs
    const fetchUnapprovedNGOs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/ngos");
        setNgos(response.data);
      } catch (error) {
        console.error("Error fetching NGOs", error);
      }
    };
    fetchUnapprovedNGOs();
  }, []);

  const handleApprove = async (ngoId) => {
    try {
      await axios.post(`http://localhost:5000/admin/approve-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId)); // Remove approved NGO from list
    } catch (error) {
      console.error("Error approving NGO", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Pending NGOs for Approval</h2>
      <ul>
        {ngos.map(ngo => (
          <li key={ngo._id}>
            {ngo.name} - {ngo.email}
            <button onClick={() => handleApprove(ngo._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
