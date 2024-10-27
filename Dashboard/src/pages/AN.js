import React, { useEffect, useState } from 'react';
import '../App.css';
import '../components/alert.css';

const AN = () => {
    const [isUpdated, setIsUpdated] = useState(false);
    const [lastCheckTime, setLastCheckTime] = useState(new Date().toISOString());

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/check-update?last_check_time=${encodeURIComponent(lastCheckTime)}`);
                const data = await response.json();

                if (data.updated) {
                    setIsUpdated(true);
                    setLastCheckTime(new Date().toISOString()); // Update last check time
                }
            } catch (error) {
                console.error('Error checking for updates:', error);
            }
        };

        checkForUpdates();

        // Polling interval to check for updates
        const intervalId = setInterval(checkForUpdates, 60000); // Check every 60 seconds

        return () => clearInterval(intervalId);
    }, [lastCheckTime]);

    return (
        <div className="alert-container">
            <h1>Alert Notifications</h1>
            <p>This page provides updates on the network performance data in Africa. The data is sourced from M-Lab and is updated regularly based on availability.</p>
            <p><strong>Note:</strong> Data availability depends on M-Lab's updates about internet performance in Africa.</p>

            {!isUpdated && (
                <div className="no-update">
                    <h2>No Recent Updates</h2>
                    <p>Currently, there are no new updates. The data will be refreshed as soon as new insights are available.</p>
                </div>
            )}

            {isUpdated && (
                <div className="alert-box show">
                    <h2>Database Updated</h2>
                    <p>The database has been updated. Please review the changes below:</p>
                </div>
            )}

            <table className="updates-table">
                <thead>
                    <tr>
                        <th>Last Checked</th>
                        <th>Status</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{new Date(lastCheckTime).toLocaleString()}</td>
                        <td>{isUpdated ? "Updated" : "No Updates"}</td>
                        <td>M-Lab (Africa Data)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AN;
