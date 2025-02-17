import React, { useEffect, useState } from "react";

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
        <div>
            <h2>Ongoing Donation Drives</h2>
            {drives.length > 0 ? (
                <ul>
                    {drives.map((drive) => (
                        <li key={drive.ein}>
                            <h3>{drive.name}</h3>
                            <p>{drive.mission}</p>
                            <a href={drive.profileUrl} target="_blank" rel="noopener noreferrer">
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
