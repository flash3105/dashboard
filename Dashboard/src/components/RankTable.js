import React, { useState, useEffect } from "react";
import './RankTable.css';
const RankTable = ({ data }) => {
    const [ranks, setRanks] = useState([]);
    const [rankingCriteria, setRankingCriteria] = useState('averageLoss');

    useEffect(() => {
        if (Array.isArray(data)) {
            // Sort and limit the rankings based on the selected criteria
            const sortedData = [...data].sort((a, b) => {
                if (rankingCriteria === 'averageLoss') {
                    return b.averageLoss - a.averageLoss;
                } else {
                    return b.averageLatency - a.averageLatency;
                }
            }).slice(0, 10);

            setRanks(sortedData);
        }
    }, [data, rankingCriteria]);

    return (
        <div className="rank-table-container">
            <div className="ranking-criteria-selector">
                <label htmlFor="rankingCriteria">Rank By:</label>
                <select
                    id="rankingCriteria"
                    value={rankingCriteria}
                    onChange={(e) => setRankingCriteria(e.target.value)}
                >
                    <option value="averageLoss">Average Loss</option>
                    <option value="averageLatency">Average Latency</option>
                </select>
            </div>

            {ranks.length > 0 ? (
                <table className="rank-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Network</th>
                            <th>Average Loss</th>
                            <th>Average Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranks.map((rank, index) => (
                            <tr key={rank.network}>
                                <td>{index + 1}</td>
                                <td>{rank.network}</td>
                                <td>{rank.averageLoss.toFixed(2)}%</td>
                                <td>{rank.averageLatency.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default RankTable;
