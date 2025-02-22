import { useState } from "react";
import { uploadImage } from "../api"; // Import the API function to handle the upload request

const UploadImage = ({ token }) => {
    const [image, setImage] = useState(null);

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image); // Append the selected image to the form data

        try {
            // Call the API to upload the image
            const response = await uploadImage(formData);
            alert("Image uploaded successfully!");
            console.log(response.data); // You can use the response to display the image URL or handle further logic
        } catch (error) {
            alert("Error uploading image. Please try again.");
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])} // Set the selected image in the state
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadImage;
