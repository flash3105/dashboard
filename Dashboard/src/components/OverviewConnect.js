import React, { useState } from 'react';
import FilterForm from './FilterForm';
import Graph from './Graph';
import Histogram from './Histogram';
import axios from 'axios';
import './OverviewConnect.css';

const OverviewConnect = () => {
    const [graphData, setGraphData] = useState([]);
    const [histoData, setHistoData] = useState([]);
    const [currentMetric, setCurrentMetric] = useState('downloads');

    const handleFilter = (place, isp, metric) => {
        if (!place || !isp) return;

        // Clear previous data if the metric changes
        if (metric !== currentMetric) {
            setGraphData([]);
            setHistoData([]);
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
       

        const histoApiUrl = metric === 'uploads'
            ? `http://127.0.0.1:5000/api/histo_upload?place=${encodeURIComponent(place)}`
            : metric === 'average'
                ? `http://127.0.0.1:5000/api/histo_average?place=${encodeURIComponent(place)}`
            : metric =='packetloss'
                ? `http://127.0.0.1:5000/api/histo_packetloss?place=${encodeURIComponent(place)}`
            : metric =='latency'
                ? `http://127.0.0.1:5000/api/histo_latency?place=${encodeURIComponent(place)}`

                : `http://127.0.0.1:5000/api/histo?place=${encodeURIComponent(place)}`;

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
                    // Add graph data
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

        // Fetch histogram data
        axios.get(histoApiUrl)
            .then(response => {
                const output = response.data.output;
                if (output && output.length > 0) {
                    setHistoData(output);
                }
            })
            .catch(error => console.error('Error fetching histogram data:', error));
    };

    return (
        <div className='container'>
            {/* Filter Form Row */}
            <div className="row">
                <div className='col-10'>
                    <FilterForm onSubmit={handleFilter} />
                </div>
            </div>

            {/* Graph and Histogram Row */}
            <div className='row'>
                <div className='col'>
                    <div>
                        {graphData.length > 0 && <Graph data={graphData} metric={currentMetric} />}
                    </div>
                </div>
                <div className='col-6 hist'>
                    <div>
                        {histoData.length > 0 && <Histogram data={histoData} metric={currentMetric} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewConnect;
