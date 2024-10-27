import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './Results.css';

const Results = ({ latestResult }) => {
    useEffect(() => {
        if (latestResult && latestResult.meanThroughputMbps) {
            // Remove the existing speedometer if any
            const svgElement = d3.select("#speedometer");
            svgElement.selectAll("*").remove(); // Clear existing SVG content

            const speedometerWidth = 260;
            const speedometerHeight = 150;
            const speedometerRadius = speedometerWidth / 2;
            const speedometerMaxAngle = Math.PI; // 180 degrees

            const svgSpeedometer = svgElement
                .attr("width", speedometerWidth)
                .attr("height", speedometerHeight)
                .append("g")
                .attr("transform", `translate(${speedometerWidth / 2}, ${speedometerHeight})`);

            // Scale for the speedometer sections
            const sectionScale = d3.scaleLinear()
                .domain([0, 210]) // Adjust this domain based on your max value
                .range([0, speedometerMaxAngle]);

            const colorScale = d3.scaleLinear()
                .domain([0, 210]) // Same domain here as well
                .range(['#00ff00', '#ff0000']); // Green to red

            const sections = d3.range(0, 201, 20);

            svgSpeedometer.selectAll("path")
                .data(sections)
                .enter()
                .append("path")
                .attr("d", d3.arc()
                    .innerRadius(speedometerRadius - 30)
                    .outerRadius(speedometerRadius)
                    .startAngle(d => sectionScale(d) - Math.PI / 2)
                    .endAngle(d => sectionScale(d + 20) - Math.PI / 2)
                )
                .attr("fill", d => colorScale(d)); // Apply the color scale

            // Add labels to the speedometer
            svgSpeedometer.selectAll("text")
                .data(sections)
                .enter()
                .append("text")
                .attr("x", d => (speedometerRadius - 40) * Math.cos(sectionScale(d - 100) - Math.PI / 2))
                .attr("y", d => (speedometerRadius - 40) * Math.sin(sectionScale(d - 100) - Math.PI / 2))
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .text(d => d)
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("fill", "black");

            // Function to rotate the needle
            const rotateNeedle = (value, maxValue = 200, duration = 2000) => {
                const needleAngle = sectionScale(value) - (Math.PI / 2);

                svgSpeedometer.selectAll("#needle").remove(); // Remove existing needle if any

                const needle = svgSpeedometer.append("line")
                    .attr("id", "needle")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", -speedometerRadius + 30)
                    .attr("stroke-width", 4)
                    .attr("stroke", "red")
                    .attr("transform", "rotate(-90)");

                needle.transition()
                    .duration(duration)
                    .attrTween("transform", function() {
                        return d3.interpolateString(`rotate(-90)`, `rotate(${(needleAngle * 180 / Math.PI)})`);
                    });

                // Add tooltip for needle
                svgSpeedometer.append("text")
                    .attr("id", "tooltip")
                    .attr("x", 0)
                    .attr("y", -speedometerRadius )
                    .attr("text-anchor", "middle")
                    .style("font-size", "17px")
                    .style("fill", "black")
                    .text(`Speed : ${value.toFixed(2)} Mbps`)
                    .style("opacity", 0); // Initially hidden

                needle.on("mouseover", () => {
                    d3.select("#tooltip").style("opacity", 1);
                }).on("mouseout", () => {
                    d3.select("#tooltip").style("opacity", 0);
                });
            };

            // Rotate the needle based on the latest result
            rotateNeedle(latestResult.meanThroughputMbps);
        }
    }, [latestResult]); // Re-render the speedometer when the latestResult changes

    return (
        <div>
           
            <svg id="speedometer"></svg>
        </div>
    );
};

export default Results;
