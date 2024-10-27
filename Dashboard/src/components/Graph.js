import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Graph.css';

const Graph = ({ data, metric }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && data.length > 0) {
            drawGraph(data);
        }
    }, [data, metric]); // Re-run the graph drawing when data or metric changes

    const drawGraph = (data) => {
        const margin = { top: 60, right: 150, bottom: 40, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);

        let g = svg.select('g.chart-area');
        if (g.empty()) {
            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append("text")
                .attr("class", "graph-title")
                .attr("x", (width + margin.left + margin.right) / 2)
                .attr("y", margin.top / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .text(`Time Series Analysis (${metric.charAt(0).toUpperCase() + metric.slice(1)})`);

            g = svg.append("g")
                .attr("class", "chart-area")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            g.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`);

            g.append("g")
                .attr("class", "y-axis");

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);
        }

        const x = d3.scaleTime()
            .domain([new Date(new Date().getFullYear(), 2, 1), new Date()])
            .range([0, width]);

        // Set y-axis scale based on the metric
        let y;
        if (metric === 'packetloss') {
            y = d3.scaleLinear().domain([0, 1]).range([height, 0]); // For packet loss, scale between 0 and 1 (percentage)
        } else if (metric === 'latency') {
            y = d3.scaleLinear().domain([0, 10000]).range([height, 0]); // For latency, scale up to 3000ms
        } else {
            y = d3.scaleLinear().domain([0, 1000]).range([height, 0]); // Default scale for other metrics
        }

        g.select(".x-axis").call(d3.axisBottom(x));
        g.select(".y-axis").call(d3.axisLeft(y));

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const groupedData = d3.groups(data, d => `${d.place}-${d.isp}`);

        g.selectAll(".line-path").remove();
        svg.selectAll(".legend").remove();

        const legendPadding = 20;

        groupedData.forEach(([key, values], index) => {
            values.forEach(d => {
                d.time = new Date(d.time);
            });

            const linePath = g.append("path")
                .datum(values)
                .attr("class", `line-path line-${index}`)
                .attr("fill", "none")
                .attr("stroke", color(key))
                .attr("stroke-width", 1.5)
                .attr("clip-path", "url(#clip)")
                .attr("d", d3.line()
                    .x(d => x(d.time))
                    .y(d => y(d.speed))
                    .curve(d3.curveMonotoneX)
                );

            const legendRect = svg.append("rect")
                .attr("class", "legend")
                .attr("x", width + margin.left + legendPadding)
                .attr("y", margin.top + index * 40)
                .attr("width", 15)
                .attr("height", 15)
                .attr("stroke-width", 10)
                .attr("stroke", color(key))
                .attr("fill", 'none')
                .on('click', function () {
                    const currentOpacity = linePath.style("opacity");
                    linePath.style("opacity", currentOpacity === "1" ? "0" : "1");
                });

            const words = key.split('-');
            const text = svg.append("text")
                .attr("class", "legend")
                .attr("x", width + margin.left + legendPadding + 20)
                .attr("y", margin.top + index * 40 + 12)
                .attr("fill", "#000");

            words.forEach((word, i) => {
                text.append("tspan")
                    .attr("x", width + margin.left + legendPadding + 100)
                    .attr("y", margin.top + index * 40 + 12 + (i * 15))
                    .text(word);
            });
        });
    };

    const downloadGraph = () => {
        const svg = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'graph.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <svg ref={svgRef}></svg>
            <button onClick={downloadGraph}>Download Graph</button>
        </>
    );
};

export default Graph;
