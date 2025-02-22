import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import "./MapPage.css";
import Navbar from "../components/Navbar";

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  // Target location: 18.5018° N, 73.8636° E
  const targetLocation = { lat: 18.5018, lng: 73.8636 };

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

  // Handle route calculation
  const calculateRoute = (map) => {
    if (location) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: location,
          destination: targetLocation,
          travelMode: window.google.maps.TravelMode.DRIVING, // You can change this to WALKING, BICYCLING, etc.
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result); // Set directions for rendering
          } else {
            console.error("Error fetching directions", result);
          }
        }
      );
    }
  };

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
        onLoad={(map) => calculateRoute(map)} // Calculate route on map load
      >
        {/* Marker to show user's current location */}
        <Marker position={location} />

        {/* DirectionsRenderer to show the route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true, // Suppress markers for start/end, as we already have our own
              polylineOptions: {
                strokeColor: "#FF0000", // Color of the road
                strokeWeight: 4, // Thickness of the route line
              },
            }}
          />
        )}

        {/* Marker for the destination */}
        <Marker position={targetLocation} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapPage;
