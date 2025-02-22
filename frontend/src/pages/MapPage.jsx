import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./MapPage.css";
import Navbar from "../components/Navbar";

const MapPage = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      // Watch the user's location in real-time
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true, // Improve accuracy of location data
          timeout: 5000,             // Timeout for retrieving location
          maximumAge: 0             // Do not use a cached location
        }
      );

      // Cleanup the watch when the component unmounts
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []); // Empty array ensures the effect runs only once

  // Return a loading screen until the location is available
  if (!location) {
    return <div>Loading map...</div>;
  }

  

  return (
    <LoadScript googleMapsApiKey="AIzaSyC1-bVbHAWMsKiXcOJ7FKs_e2ERVkhfpYQ">
      <Navbar />
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
  );
};

export default MapPage;
