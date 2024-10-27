import React, { useState, useEffect } from 'react';
import './TopISPs.css'
const TopISPs = () => {
    const [isps, setIsps] = useState([]);

    useEffect(() => {
        fetch('/cache.json')
            .then(response => response.json())
            .then(data => {
                const topIsps = data?.isps?.top_isps || [];
                setIsps(topIsps);
            })
            .catch(error => {
                console.error('Error fetching top ISPs:', error);
            });
    }, []);

    return (
        <div className='container-isps-top'>
            <h3>Frequently Searched Isps</h3>
            <ul>
                {isps.map((isp, index) => (
                    <li key={index}>
                        {isp.isp} - {isp.count} searches
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopISPs;
