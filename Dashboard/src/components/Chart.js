import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import NetworkPieChart from './NetworkPieChart'; 
import './Chart.css';
import RankTable from './RankTable';

const Chart = () => {
    const [networks, setNetworks] = useState([]);
    const [clickedLocation, setClickedLocation] = useState(null);
    const [loading, setLoading] = useState(false); // New state for loading
    const [radius] = useState(100000); // Default radius in meters

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setClickedLocation({ lat, lng });
        setLoading(true); // Start loading

        fetch(`http://127.0.0.1:5000/api/networks-by-region?lat=${lat}&long=${lng}&radius=${radius / 1000}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.networks && data.networks.length > 0) {
                    setNetworks(data.networks);
                } else {
                    console.error('No networks found');
                    setNetworks([]); // Clear the networks if no data is found
                }
            })
            .catch((error) => {
                console.error('Error fetching networks:', error);
                setNetworks([]); // Clear the networks on error
            })
            .finally(() => {
                setLoading(false); // End loading
            });
    };

    function MapClickHandler() {
        useMapEvents({
            click: handleMapClick
        });
        return null;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <MapContainer center={[0, 0]} zoom={2} className="map-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler />
                        {clickedLocation && (
                            <Circle
                                center={[clickedLocation.lat, clickedLocation.lng]}
                                radius={radius} 
                                color="blue"
                                fillColor="blue"
                                fillOpacity={0.2}
                            />
                        )}
                    </MapContainer>
                </div>
                <div className='col'>
                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Loading...</p>
                        </div>
                    ) : networks.length > 0 ? (
                        <RankTable data={networks} />
                    ) : (
                        <p>No data for this place.</p>
                    )}
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <div className="chart-wrap-1">
                        <h3>ISP Occurrence Data for Selected Region</h3>
                        {loading ? (
                            <div className="loading-container">
                                <div className="loader"></div>
                                <p>Loading...</p>
                            </div>
                        ) : networks.length > 0 ? (
                            <NetworkPieChart data={networks} />
                        ) : (
                            <p>No data for this place.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;
