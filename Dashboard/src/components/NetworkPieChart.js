import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './NetworkPieChart.css';

const NetworkPieChart = ({ data }) => {
    const svgRef = useRef(null);
    const legendRef = useRef(null);
    const [tooltip, setTooltip] = useState({ display: false, content: '' });

    useEffect(() => {
        // Dimensions and radius
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        // Sort data by percentage in descending order
        const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

        // Slice the top 10 and group the rest under "Other"
        const top10Data = sortedData.slice(0, 10);
        const otherData = sortedData.slice(10);

        // Calculate the "Other" percentage
        const otherTotalPercentage = otherData.reduce((acc, d) => acc + d.percentage, 0);
        if (otherTotalPercentage > 0) {
            top10Data.push({
                network: 'Other',
                percentage: otherTotalPercentage,
                averageLoss: otherData.reduce((acc, d) => acc + d.averageLoss, 0) / otherData.length,
                averageLatency: otherData.reduce((acc, d) => acc + d.averageLatency, 0) / otherData.length,
            });
        }

        // Create SVG container
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create pie chart
        const pie = d3.pie()
            .value(d => d.percentage);

        const arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const arcLabel = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        // Append pie chart slices
        const g = svg.selectAll('.arc')
            .data(pie(top10Data)) // Use the top 10 data + "Other"
            .enter().append('g')
            .attr('class', 'arc');

        g.append('path')
            .attr('d', arc)
            .style('fill', d => color(d.data.network))
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget).style('opacity', 0.7);
                d3.select(legendRef.current).selectAll('.legend-item').each(function (data) {
                    if (data.network === d.data.network) {
                        d3.select(this).select('.percentage').style('opacity', 1);
                    } else {
                        d3.select(this).select('.percentage').style('opacity', 0.3);
                    }
                });

                // Update tooltip content with avgLoss and avgLatency
                setTooltip({
                    display: true,
                    content: `
                        <div>Network: ${d.data.network}</div>
                        <div>Avg Loss: ${d.data.averageLoss.toFixed(2)}%</div>
                        <div>Avg Latency: ${d.data.averageLatency.toFixed(2)}ms</div>
                    `
                });
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget).style('opacity', 1);
                d3.select(legendRef.current).selectAll('.percentage').style('opacity', 1);
                setTooltip({ display: false, content: '' });
            });

        // Append legend for top 10 and "Other"
        const legend = d3.select(legendRef.current)
            .selectAll('.legend-item')
            .data(top10Data)
            .enter().append('div')
            .attr('class', 'legend-item');

        legend.append('span')
            .attr('class', 'legend-color-box')
            .style('background-color', d => color(d.network))
            .style('border-radius', '5px'); // Optional: add rounded corners

        legend.append('span')
            .attr('class', 'legend-text')
            .text(d => d.network);

        legend.append('span')
            .attr('class', 'percentage')
            .text(d => ` ${d.percentage.toFixed(2)}%`);

        // Cleanup on component unmount
        return () => {
            d3.select(svgRef.current).selectAll('*').remove();
            d3.select(legendRef.current).selectAll('*').remove();
        };
    }, [data]);

    return (
        <div className="chart-container-2">
            <div className='pie'>
                <svg ref={svgRef} />
                {tooltip.display && (
                    <div className="tooltip" style={{ position: 'absolute', left: '50%', top: '10%', transform: 'translate(-50%, 0)', background: 'white', padding: '5px', border: '1px solid black', borderRadius: '5px' }}>
                        <div dangerouslySetInnerHTML={{ __html: tooltip.content }} />
                    </div>
                )}
            </div>
            <div ref={legendRef} className="legend" />
        </div>
    );
};

export default NetworkPieChart;
