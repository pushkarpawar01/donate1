import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Import Leaflet CSS for proper map rendering
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const markerRef = useRef(null); // Store the marker reference to update it

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Only update if the accuracy is within a reasonable range
          if (accuracy <= 100) {
            setUserLocation({ lat: latitude, lng: longitude });
            setLoading(false);

            // Update the marker position
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            }
          } else {
            setError('Location accuracy is too low.');
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          setError('Unable to retrieve location.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,  // Request high accuracy
          timeout: 10000,            // Timeout after 10 seconds
          maximumAge: 0              // Do not use cached location
        }
      );

      // Cleanup the watch on unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocation is not available in this browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation && !loading) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Create the marker and store it in a ref to update it
      markerRef.current = L.marker([userLocation.lat, userLocation.lng]).addTo(map);
      markerRef.current.bindPopup('You are here').openPopup();

      // Cleanup map when the component is unmounted
      return () => {
        map.remove();
      };
    }
  }, [userLocation, loading]);

  if (loading) {
    return <div>Loading your location...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Current Location on the Map</h2>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '500px' }}
      ></div>
    </div>
  );
};

export default MapPage;
