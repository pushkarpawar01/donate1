import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!userLocation) {
    return <div>Loading your location...</div>;
  }

  // Custom icon for the user location marker
  const userIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            You are here!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;
