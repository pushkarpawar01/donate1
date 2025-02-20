import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // To store the user's location

  useEffect(() => {
    const initMap = async () => {
      const L = await import('leaflet');

      const mapInstance = L.map("map", {
        zoomControl: false,
        maxBounds: [
          [33.5, -119.0], // Southwest corner
          [34.5, -117.5], // Northeast corner
        ],
        maxBoundsViscosity: 1.0, // Keeps user inside the bounds
      }).setView([34.0522, -118.2437], 12); // Center on LA initially

      // Define tile layers
      const lightTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      lightTiles.addTo(mapInstance);

      // Adding zoom controls
      L.control.zoom({
        position: "topright",
      }).addTo(mapInstance);

      // Store map instance
      setMap(mapInstance);

      // Get user's current location with high accuracy
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserLocation([lat, lng]);

            // Set map view to user's location
            mapInstance.setView([lat, lng], 13); // Zoom level can be adjusted

            // Add a marker for the user's location
            L.marker([lat, lng])
              .addTo(mapInstance)
              .bindPopup("You are here")
              .openPopup();
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not get accurate location.");
          },
          {
            enableHighAccuracy: true, // This improves the accuracy
            timeout: 5000, // Set a timeout for how long the browser should try to get the location
            maximumAge: 0, // Do not use a cached position
          }
        );
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map) map.remove();
    };
  }, []); // Initial map setup

  return (
    <div id="map" className="w-full h-screen z-10" />
  );
};

export default MapPage;
