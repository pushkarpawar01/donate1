import axios from "axios";

// Create an instance of axios with the base URL for API requests
const API = axios.create({ baseURL: "http://localhost:5000" });

// Upload Image Function
export const uploadImage = async (formData) => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    if (!token) {
        alert("No token found! Please log in.");
        return;
    }

    try {
        const response = await API.post("/api/users/upload", formData, {
            headers: {
                "Authorization": `Bearer ${token}`, // Add the token to the request header
                "Content-Type": "multipart/form-data", // Important: Ensure correct content type for file uploads
            },
        });
        return response;
    } catch (error) {
        console.error("Error uploading image", error);
        throw error; // Propagate error to the component
    }
};
