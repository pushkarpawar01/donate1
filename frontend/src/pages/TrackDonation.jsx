import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useParams } from "react-router-dom";
import axios from "axios";

const TrackDonation = () => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    // Fetch donation data by ID
    axios.get(`/api/get-donation/${donationId}`).then((response) => {
      setDonation(response.data);
    });
  }, [donationId]);

  if (!donation) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Track Donation</h1>
      <MapContainer
        center={[donation.donorLocation.coordinates[1], donation.donorLocation.coordinates[0]]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Donor's Location */}
        <Marker position={[donation.donorLocation.coordinates[1], donation.donorLocation.coordinates[0]]}>
          <Popup>Donor Location</Popup>
        </Marker>

        {/* Volunteer’s Location */}
        {donation.volunteerLocation && (
          <Marker position={[donation.volunteerLocation.coordinates[1], donation.volunteerLocation.coordinates[0]]}>
            <Popup>Volunteer Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackDonation;
