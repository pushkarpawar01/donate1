// src/components/MapPage.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

const MapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]); // Set current position
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  // Custom Marker Icon (optional)
  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Leaflet default marker icon URL
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div style={{ height: '100vh' }}>
      {/* Only render the map if we have the user's current location */}
      {currentLocation ? (
        <MapContainer
          center={currentLocation} // Set the map center to the current location
          zoom={15} // Zoom level (adjust as needed)
          style={{ width: '100%', height: '100%' }}
        >
          {/* TileLayer: You can use any tile source, here we use OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker for the user's current location */}
          <Marker position={currentLocation} icon={customIcon}>
            <Popup>
              <span>You are here</span>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default MapPage;
