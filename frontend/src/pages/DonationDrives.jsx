import React, { useEffect, useState } from "react";
import "./DonationDrives.css";  // Importing the CSS file

const DonationDrives = () => {
    const [drives, setDrives] = useState([]);

    useEffect(() => {
        fetch("https://partners.every.org/v0.2/search/food?apiKey=pk_live_6f490e673cf00003aac248da6df88cd1")
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging
                setDrives(data.nonprofits || []);
            })
            .catch((error) => console.error("Error fetching donation drives:", error));
    }, []);

    return (
        <div className="donation-drives-container">
            <h2>Ongoing Donation Drives</h2>
            {drives.length > 0 ? (
                <ul className="drives-list">
                    {drives.map((drive) => (
                        <li key={drive.ein} className="drive-item">
                            <h3>{drive.name}</h3>
                            <p>{drive.mission}</p>
                            <a href={drive.profileUrl} target="_blank" rel="noopener noreferrer" className="visit-page-link">
                                Visit Page
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading donation drives...</p>
            )}
        </div>
    );
};

export default DonationDrives;
