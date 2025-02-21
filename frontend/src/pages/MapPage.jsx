import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./MapPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MapPage = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  // Return a loading screen until the location is available
  if (!location) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <Navbar/>
    <LoadScript googleMapsApiKey="AIzaSyCxjQQacq1Jh93rd-if6VdE496o3zV8rLo">
      <GoogleMap
        mapContainerStyle={{
          width: "100vw",
          height: "100vh",
        }}
        center={location}
        zoom={15}
      >
        {/* Marker to show user's current location */}
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
    </div>
  );
};

export default MapPage;
