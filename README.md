# EN-4: A Digital Platform for Food Redistribution

## Overview

EN-4 is a MERN (MongoDB, Express.js, React, Node.js) full-stack web application designed to connect surplus food sources with NGOs for real-time redistribution and waste reduction. The platform enables donors to list excess food, while NGOs can browse and accept donations efficiently.

## Features

- **User Authentication**: Secure sign-up and login system.
- **Role Selection**: Users register as either a **Donor** or an **NGO**.
- **Food Donation**: Donors can enter details such as food type, quantity, expiry date, contact information, and location.
- **NGO Dashboard**: NGOs can view available food donations and either **Accept** or **Decline** requests.
- **Real-Time Updates**: Instant updates on donation statuses.
- **Integration with ML Model**: Machine learning insights for optimizing food distribution.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Render, Vercel

## Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/en4.git
   cd en4
   ```
2. **Backend Setup**
   ```bash
   cd TEST1  # Backend folder
   npm install
   npm start
   ```
3. **Frontend Setup**
   ```bash
   cd frontend  # Change to your frontend folder
   npm install
   npm run dev
   ```
4. **Environment Variables**
   - Create a `.env` file in `TEST1` (backend) with:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Create a `.env` file in `frontend` (React app) with:
     ```env
     VITE_API_BASE_URL=http://localhost:5000
     ```

## API Endpoints

- **User Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login user
- **Donor Actions**
  - `POST /api/donations` - Create a food donation
  - `GET /api/donations` - Get all donations
- **NGO Actions**
  - `GET /api/donations` - View available donations
  - `PUT /api/donations/:id/accept` - Accept a donation
  - `PUT /api/donations/:id/decline` - Decline a donation

## Future Enhancements

- **Map Integration**: Display real-time donation locations.
- **Automated Expiry Alerts**: Notify NGOs about expiring food.
- **Chat System**: Real-time communication between donors and NGOs.
- **AI-Based Matching**: Improve food distribution efficiency using ML.

## License

This project is licensed under the MIT License.

---

Feel free to contribute and make a difference in reducing food waste!

