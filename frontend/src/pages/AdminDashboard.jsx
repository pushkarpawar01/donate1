import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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
  const handleApprove = async (ngoId, ngoName) => {
    const confirmApproval = window.confirm("Are you sure you want to approve this NGO?");
    if (!confirmApproval) return;

    try {
      await axios.post(`http://localhost:5000/admin/approve-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId)); // Remove from list
      setNotifications([...notifications, { message: `${ngoName} has been approved.`, type: "success" }]);
      navigate('/admin-notifications', { state: { notifications } });
    } catch (error) {
      setError("Failed to approve NGO. Please try again.");
      console.error("Error approving NGO:", error);
    }
  };

  // Decline NGO
  const handleDecline = async (ngoId, ngoName) => {
    const confirmDecline = window.confirm("Are you sure you want to decline this NGO?");
    if (!confirmDecline) return;

    try {
      await axios.post(`http://localhost:5000/admin/decline-ngo/${ngoId}`);
      setNgos(ngos.filter(ngo => ngo._id !== ngoId)); // Remove from list
      setNotifications([...notifications, { message: `${ngoName} has been declined.`, type: "error" }]);
      navigate('/admin-notifications', { state: { notifications } });
    } catch (error) {
      setError("Failed to decline NGO.");
      console.error("Error declining NGO:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <br /><br /><br /><br />
      <div className='approval-div'>
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
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngos.map(ngo => (
                <tr key={ngo._id}>
                  <td>{ngo.name}</td>
                  <td>{ngo.email}</td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(ngo._id, ngo.name)}>Approve</button>
                    <button className="decline-btn" onClick={() => handleDecline(ngo._id, ngo.name)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default AdminDashboard;
