import React, { useState } from 'react';
import FilterForm from './FilterForm';
import Results from './Results';
import Graph from './Graph';
import MapComponent from './MapComponent';
import './Sections.css';
import axios from 'axios';

const Section = () => {
    const [latestResults, setLatestResults] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [coordinatesList, setCoordinatesList] = useState([]);
    const [currentMetric, setCurrentMetric] = useState('downloads');

    const handleFilter = (place, isp, metric) => {
        if (!place || !isp) return;

        // Clear previous data if the metric changes
        if (metric !== currentMetric) {
            setGraphData([]);
        }

        setCurrentMetric(metric);

        // Determine API routes based on metric
        const graphApiUrl = metric === 'uploads'
            ? `http://127.0.0.1:5000/api/filter_upload?place=${encodeURIComponent(place)}&isp=${encodeURIComponent(isp)}`
            : metric === 'average'
                ? `http://127.0.0.1:5000/api/filter_average?place=${encodeURIComponent(place)}&isp=${encodeURIComponent(isp)}`
                : metric === 'latency'
                    ? `http://127.0.0.1:5000/api/filter_latency?place=${encodeURIComponent(place)}&isp=${encodeURIComponent(isp)}`
                    : metric === 'packetloss'
                        ? `http://127.0.0.1:5000/api/filter_packetloss?place=${encodeURIComponent(place)}&isp=${encodeURIComponent(isp)}`
                        : `http://127.0.0.1:5000/api/filter?place=${encodeURIComponent(place)}&isp=${encodeURIComponent(isp)}`;

        // Fetch data for the selected metric
        axios.get(graphApiUrl)
            .then(response => {
                const results = response.data.results;
                if (results && results.length > 0) {
                    const sortedResults = results.map(result => ({
                        ...result,
                        TestTime: new Date(result.testTime) // Convert TestTime to Date object
                    })).sort((a, b) => b.TestTime - a.TestTime);

                    // Update graph data
                    setGraphData(prev => [
                        ...prev,
                        ...sortedResults.map(result => ({
                            time: result.TestTime,
                            speed: result.meanThroughputMbps,
                            place,
                            isp
                        }))
                    ]);
                }
            })
            .catch(error => console.error('Error fetching graph data:', error));

        // Fetch coordinates
        axios.get(`http://127.0.0.1:5000/api/coordinates?place=${place}`)
            .then(res => {
                const { lat, long } = res.data;
                setCoordinatesList(prev => [...prev, { lat, long, place }]);
            })
            .catch(error => console.error('Error fetching coordinates:', error));
    };

    return (
        <div className='container'>
            <div className="row bl">
                <div className='col rf'>
                    <FilterForm onSubmit={handleFilter} />
                </div>
                <div className='col'>
                    <div className="con">
                        {/* Conditionally render "Latest Speed" section */}
                        {currentMetric !== 'packetloss' && currentMetric !== 'latency' && (
                            <>
                                <h3>Latest Speed</h3>
                                {latestResults.map((result, index) => (
                                    <Results key={index} place={result.place} isp={result.isp} latestResult={result.latest} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Component displaying multiple coordinates */}
            <div className='row'>
                <div className='col'>
                    {coordinatesList.length > 0 && <MapComponent coordinates={coordinatesList} className='draw' />}
                </div>
            </div>

            <div className='row'>
                <div className='col'>
                    <div className="con-graph">
                        {graphData.length > 0 && <Graph data={graphData} metric={currentMetric} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;
