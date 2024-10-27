import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Histogram.css';

const Histogram = ({ data, metric }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const margin = { top: 60, right: 30, bottom: 90, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Clear the SVG before re-rendering
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Append a group element and apply margin transformation
        const container = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Add the title inside the SVG
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .text(`ISP Throughput Histogram (${metric.charAt(0).toUpperCase() + metric.slice(1)})`);

        // X Scale
        const x = d3.scaleBand()
            .domain(data.map(d => d.isp))  // Use ISP names for x domain
            .range([0, width])
            .padding(0.2);  // Adjust padding for spacing between bars

        // Y Scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.avg)])  // Use average throughput for y domain
            .nice()
            .range([height, 0]);

        // Color Scale for bars
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.isp));

        // X Axis
        container.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Y Axis
        container.append("g")
            .call(d3.axisLeft(y));

        // Tooltip div element
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px");

        // Bars with hover interaction
        container.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.isp))  // Corrected to use ISP names for bar position
            .attr("y", d => y(d.avg))  // Positioning based on avg
            .attr("width", x.bandwidth())  // Bar width based on x scale
            .attr("height", d => height - y(d.avg))  // Bar height based on y scale
            .attr("fill", d => color(d.isp))
            .on("mouseover", function (event, d) {  // Show tooltip on hover
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(`${d.isp}: ${d.avg.toFixed(2)} `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {  // Hide tooltip on mouseout
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Cleanup on unmount
        return () => {
            svg.selectAll("*").remove();
            tooltip.remove();  // Clean up the tooltip
        };
    }, [data]);

    const downloadHisto = () => {
        const svg = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Histogram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="histogram-container">
            <svg ref={svgRef}></svg>
            <button onClick={downloadHisto}>Download Histogram</button>
        </div>
    );
};

export default Histogram;
