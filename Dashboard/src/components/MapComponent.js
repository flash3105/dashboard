import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Import Leaflet's default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define default Leaflet icon with corrected paths
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Anchor the icon properly to the point
    popupAnchor: [1, -34], // Position of popup relative to the icon
    shadowSize: [41, 41] // Shadow size
});

// Component to fit the map's bounds to include all markers
const FitMapBounds = ({ markers }) => {
    const map = useMap();
    
    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.long]));
            map.fitBounds(bounds);
        }
    }, [markers, map]);

    return null;
};

// Set view on each click of a marker or position update
const SetViewOnClick = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
        if (position[0] !== 0 && position[1] !== 0) {
            map.setView(position, 10); // Set zoom level dynamically
        }
    }, [position, map]);

    return null;
};

const MapComponent = ({ coordinates }) => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            setPositions(coordinates);
        }
    }, [coordinates]);

    // You can set the default position as the first place if positions exist
    const defaultPosition = positions.length > 0 ? [positions[0].lat, positions[0].long] : [0, 0];

    return (
        <MapContainer center={defaultPosition} zoom={2} style={{ height: '400px', width: '50%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Adjust the map view based on multiple markers */}
            <FitMapBounds markers={positions} />
            
            {/* Set view when clicking or updating */}
            {defaultPosition[0] !== 0 && defaultPosition[1] !== 0 && (
                <SetViewOnClick position={defaultPosition} />
            )}

            {/* Render a marker for each position */}
            {positions.map((pos, index) => (
                <Marker key={index} position={[pos.lat, pos.long]} icon={defaultIcon}>
                    <Popup>{pos.place}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
