import React, { useEffect, useState } from 'react';
import './NetworkStats.css';
import { FaTachometerAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
const NetworkStats = () => {
    const [stats, setStats] = useState({
        averageDownloadSpeed: 0,
        averageUplodSpeed: 0,
        averageLatency: 0,
        averagePacketLoss: 0,
    });

    useEffect(() => {
        fetch('/cache.json')
            .then(response => response.json())
            .then(data => {
                const cachedStats = data['networkPerformanceAverages'];
                if (cachedStats) {
                    setStats({
                        averageDownloadSpeed: cachedStats.averageDownloadSpeed.toFixed(2),
                        averageUploadSpeed: data['networkPerformanceUploads'].averageUploadSpeed.toFixed(2),
                        averageLatency: cachedStats.averageLatency.toFixed(2),
                        averagePacketLoss: cachedStats.averagePacketLoss.toFixed(2),
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching cached data:', error);
            });
    }, []);

    return (
            <>
            <div className="Avg">
                 <h3>Average African NetworkStats</h3>
                 </div>
        <div className="network-stats-container">
           
            <div className="stat-item1">
            <FaTachometerAlt className="icon" />
                <h3>Download Speed</h3>
                <p>{stats.averageDownloadSpeed} Mbps</p>
            </div>
            <div className="stat-item2">
            <FaTachometerAlt className="icon" />
                <h3>Upload Speed</h3>
                <p>{stats.averageUploadSpeed} Mbps</p>
            </div>
            <div className="stat-item3">
            <FaClock className="icon" />
                <h3>Latency</h3>
                <p>{stats.averageLatency} ms</p>
            </div>
            <div className="stat-item4">
            <FaExclamationTriangle className="icon" />
                <h3>Packet Loss</h3>
                <p>{stats.averagePacketLoss} %</p>
            </div>
        </div>
        </>
    );
};

export default NetworkStats;
