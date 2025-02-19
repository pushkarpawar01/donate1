// import React, { useState } from 'react';
// import axios from 'axios';

// const FoodRequestForm = () => {
//   const [numPeople, setNumPeople] = useState('');
//   const [message, setMessage] = useState('');


//   const handleRequestFood = async () => {
//     if (numPeople <= 0) {
//       setMessage('Please provide a valid number of people.');
//       return;
//     }

//     try {

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('User is not authenticated');
//         return;
//       }

 
//       const response = await axios.get('/user', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const { name, email, ngo_mail } = response.data;


//       const notificationResponse = await axios.post(
//         '/request-food',
//         {
//           ngoName: name,
//           ngoEmail: email,
//           ngoContact: ngo_mail,
//           numPeople: numPeople,
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(notificationResponse.data.message);
//       setNumPeople('');

//     } catch (error) {
//       console.error('❌ Error sending food request:', error);
//       setMessage('Error sending food request. Please try again.');
//     }
//   };

//   return (
//     <div className="food-request-form">
//       <h2>Request Food from Donors</h2>
//       <div>
//         <label htmlFor="numPeople">Number of People:</label>
//         <input
//           type="number"
//           id="numPeople"
//           value={numPeople}
//           onChange={(e) => setNumPeople(e.target.value)}
//           min="1"
//           required
//         />
//       </div>
//       <div>
//         <button onClick={handleRequestFood}>Request Food</button>
//       </div>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default FoodRequestForm;
