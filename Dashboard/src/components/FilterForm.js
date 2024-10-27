import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FilterForm.css';

const FilterForm = ({ onSubmit }) => {
    const [places, setPlaces] = useState([]);
    const [isps, setIsps] = useState([]);
    const [place, setPlace] = useState('');
    const [isp, setIsp] = useState('');
    const [metric, setMetric] = useState('downloads'); // Default to 'downloads'

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/places')
            .then(response => setPlaces(response.data.places))
            .catch(error => console.error('Error fetching places:', error));
    }, []);

    const handlePlaceChange = (e) => {
        const selectedPlace = e.target.value;
        setPlace(selectedPlace);

        if (selectedPlace) {
            // Fetch ISPs for the selected place
            axios.get(`http://127.0.0.1:5000/api/isps?place=${selectedPlace}`)
                .then(response => setIsps(response.data.isps))
                .catch(error => console.error('Error fetching ISPs:', error));
        } else {
            setIsps([]);
        }
    };

    const handleAdd = () => {
        // Pass the place, ISP, and metric to the parent for filtering and mapping
        onSubmit(place, isp, metric);
    };

    return (
        <form onSubmit={e => e.preventDefault()}>
            <h3>View Network Performance</h3>
            <div className="form-group">
                <div className='metric-filter'>
                    <label htmlFor="metric-select">Metric</label>
                    <select id="metric-select" value={metric} onChange={e => setMetric(e.target.value)}>
                        <option value="downloads">Downloads</option>
                        <option value="uploads">Uploads</option>
                        <option value="average">Average</option>
                        <option value="latency">Latency</option>
                        <option value="packetloss">PacketLoss</option>
                    </select>
                </div>

                <div className="location">
                    <label htmlFor="place-select">Location</label>
                    <select id="place-select" value={place} onChange={handlePlaceChange}>
                        <option value="">Select a place</option>
                        {places.map((place, index) => (
                            <option key={index} value={place}>{place}</option>
                        ))}
                    </select>
                   
                </div>
                <div className='isp-filter'>
                    <label htmlFor="isp-select">ISP</label>
                    <select id="isp-select" value={isp} onChange={e => setIsp(e.target.value)} disabled={!place}>
                        <option value="">Select an ISP</option>
                        {isps.map((isp, index) => (
                            <option key={index} value={isp}>{isp}</option>
                        ))}
                    </select>
                </div>
                
            </div>
            <button type="button" onClick={handleAdd}>Add</button>
        </form>
    );
};

export default FilterForm;
