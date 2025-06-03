# Environment Variables Setup

This file explains the environment variables required for the backend.

Create a `.env` file in the `backend` directory with the following variables:

```
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

Make sure to replace the placeholder values with your actual credentials.

**Important:** Do NOT commit the `.env` file to version control. It is already included in `.gitignore`.
