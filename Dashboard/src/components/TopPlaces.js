import React, { useState, useEffect } from 'react';
import './TopPlaces.css'
const TopPlaces = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        fetch('/cache.json')
            .then(response => response.json())
            .then(data => {
                const topPlaces = data?.places?.top_places || [];
                setPlaces(topPlaces);
            })
            .catch(error => {
                console.error('Error fetching top places:', error);
            });
    }, []);

    return (
        <div className='top-places-container'>
            <h3>Frequently Searched Places </h3>
            <ul>
                {places.map((place, index) => (
                    <li key={index}>
                        {place.place} - {place.count} searches
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopPlaces;
