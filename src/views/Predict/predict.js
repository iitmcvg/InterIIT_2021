import React, { useState } from 'react';
import * as d3 from 'd3';

import { Typography } from '@material-ui/core';

import UploadImages from './upload';
import './upload.css';

class PieBarChart extends React.Component {
  componentDidMount() {
    const data = [
      { name: 'speed (80)', value: '1500' },
      { name: 'speed (70)', value: '1200' },
      { name: 'speed (60)', value: '900' },
      { name: 'speed (50)', value: '800' },
      { name: 'speed (90)', value: '300' },
      { name: 'U Turn', value: '495' },
      { name: 'No Parking', value: '150' },
      { name: 'Signal1', value: '795' },
      { name: 'Signal 2', value: '540' },
      { name: 'Police', value: '122' },
      { name: 'Signal 3', value: '1100' },
      { name: 'Left', value: '340' },
      { name: 'Right', value: '640' },
      { name: 'Side', value: '874' },
    ];
    this.drawPieChart(data);
  }
  drawPieChart(data) {
    const width = 1500;
    const height = 500;
    const radius = (Math.min(width, height) / 2) * 0.8;
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);
    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    const outerRadius = Math.min(width, height) / 2;

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );
    const arcs = pie(data);

    const svg = d3
      .select(this.refs.canvas)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    svg
      .append('g')
      .attr('stroke', 'white')
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (d) => color(d.data.name))
      .attr('d', arc)
      .append('title')
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text((d) => d.data.value.toLocaleString())
      );

    return svg.node();
  }
  render() {
    return (
      // <div class='tile'>
      <div ref='canvas'></div>
      // </div>
    );
  }
}
class BarChart extends React.Component {
  componentDidMount() {
    const data = [
      [
        { name: 'E', value: 0.12702, title: 'Graph 1' },
        { name: 'T', value: 0.09056 },
        { name: 'A', value: 0.08167 },
        { name: 'O', value: 0.07507 },
        { name: 'I', value: 0.06966 },
        { name: 'N', value: 0.06749 },
        { name: 'S', value: 0.06327 },
        { name: 'H', value: 0.06094 },
        { name: 'R', value: 0.05987 },
        { name: 'D', value: 0.04253 },
        { name: 'L', value: 0.04025 },
        { name: 'C', value: 0.02782 },
        { name: 'U', value: 0.02758 },
        { name: 'M', value: 0.02406 },
        { name: 'W', value: 0.0236 },
        { name: 'F', value: 0.02288 },
        { name: 'G', value: 0.02015 },
        { name: 'Y', value: 0.01974 },
        { name: 'P', value: 0.01929 },
        { name: 'B', value: 0.01492 },
      ],
      [
        { name: 'Left', value: 0.92, title: 'Graph 2' },
        { name: 'Right', value: 0.09056 },
        { name: 'Signal', value: 0.08167 },
        { name: 'Parking', value: 0.07507 },
        { name: 'U Turn', value: 0.06966 },
        { name: 'Speed', value: 0.06749 },
      ],
      [
        { name: 'Left', value: 0.1, title: 'Graph 3' },
        { name: 'Right', value: 0.09056 },
        { name: 'Signal', value: 0.08167 },
        { name: 'Parking', value: 0.07507 },
        { name: 'U Turn', value: 0.96966 },
        { name: 'Speed', value: 0.06749 },
      ],
    ];

    for (let datas of data) {
      datas = this.pyramid(datas);
      this.drawBarChart(datas);
    }
  }
  pyramid(arr) {
    var newArr = [];

    // sort numerically
    arr.sort(function (a, b) {
      return a - b;
    });

    // put the biggest in new array
    newArr.push(arr.pop());

    // keep grabbing the biggest remaining item and alternate
    // between pushing and unshifting onto the new array
    while (arr.length) {
      newArr[arr.length % 2 === 0 ? 'push' : 'unshift'](arr.pop());
    }

    return newArr;
  }
  drawBarChart(data, title) {
    const canvasHeight = 400;
    const canvasWidth = 600;
    const scale = 1;
    const margin = { top: 30, right: 0, bottom: 0, left: 40 };

    const x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, canvasWidth - margin.right])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([canvasHeight - margin.bottom, margin.top]);
    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text(data.y)
        );
    const xAxis = (g) =>
      g.attr('transform', `translate(0,${canvasHeight - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .tickFormat((i) => data[i].name)
          .tickSizeOuter(0)
      );

    const svgCanvas = d3
      .select(this.refs.canvas)
      .append('svg')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .attr('class', 'tile')
      .attr('viewBox', [0, 0, canvasWidth * scale, canvasHeight * scale]);
    // .style('border', '1px solid black');
    svgCanvas
      .append('g')
      .attr('fill', 'red')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => x(i))
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .append('title')
      .text((d) => `${d.value} `);
    svgCanvas
      .append('text')
      .attr('x', canvasWidth / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text(data[0].title);

    svgCanvas.append('g').call(xAxis);

    svgCanvas.append('g').call(yAxis);
  }

  render() {
    return (
      // <div class='tile'>
      <div ref='canvas'></div>
      // </div>
    );
  }
}

const Results = () => {
  return (
    <div>
      <div class='top'>
        {/* <div class='centered'> */}
        <div className='container'>
          <div className='mg20'>
            <Typography variant='h5'>Upload Images to Test</Typography>
          </div>
          <UploadImages />
        </div>
        {/* </div> */}
      </div>

      <div class='bottom'>
        <div class='centered'>
          <h1>Results</h1>
          <PieBarChart />
          <div class='grid-layout'>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
