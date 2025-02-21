import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

const MapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  useEffect(() => {
    // Check if geolocation is available and get user's position
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,  // Attempt to get the most accurate location
        timeout: 10000,  // Timeout after 10 seconds
        maximumAge: 0,   // Don't use cached location
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Location accuracy: ${accuracy} meters`);

          // If accuracy is greater than a threshold, notify the user
          if (accuracy > 100) {
            alert('Location accuracy is poor. You might be on a desktop or using a non-GPS device.');
          }

          setCurrentLocation([latitude, longitude]); // Set current position
          setLocationAccuracy(accuracy); // Set the accuracy in state
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        },
        geoOptions
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
              {locationAccuracy && <p>Accuracy: {locationAccuracy} meters</p>}
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
