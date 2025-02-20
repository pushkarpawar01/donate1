import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const defaultLocation = [51.505, -0.09]; // Default coordinates (London) or any fallback location

  useEffect(() => {
    // Use the browser's Geolocation API to get the current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setVolunteerLocation([latitude, longitude]);
        },
        (error) => {
          let errorMessage = "Failed to get location.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Permission denied. Please enable location services.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information is unavailable.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "The request to get user location timed out.";
          }
          setLocationError(errorMessage);
          console.error("Geolocation error:", error);  // Log the error to the console for more details
          setVolunteerLocation(defaultLocation); // Set default location if geolocation fails
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setVolunteerLocation(defaultLocation); // Set default location if geolocation is not supported
    }
  }, []);

  // If location is still being fetched or there's an error, show loading/error message
  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (!volunteerLocation) {
    return <div>Loading map...</div>;
  }

  // Set up the map center based on the volunteer's location
  const MapCenter = ({ location }) => {
    const map = useMap();
    map.setView(location, map.getZoom()); // Update the map's center based on the user's location
    return null;
  };

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={volunteerLocation} // Center the map based on the fetched location
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Dynamically update the map's center */}
        <MapCenter location={volunteerLocation} />
        <Marker position={volunteerLocation}>
          <Popup>
            Volunteer is here!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;
