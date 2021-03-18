import React from 'react';
import * as d3 from 'd3';

import { Typography } from '@material-ui/core';

import UploadImages from './upload';
import './upload.css';


class BarChart extends React.Component {
  componentDidMount() {
    const data = [
      [
        { name: 'E', value: 0.12702 },
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
        { name: 'Left', value: 0.92 },
        { name: 'Right', value: 0.09056 },
        { name: 'Signal', value: 0.08167 },
        { name: 'Parking', value: 0.07507 },
        { name: 'U Turn', value: 0.06966 },
        { name: 'Speed', value: 0.06749 },
      ],
      [
        { name: 'Left', value: 0.1 },
        { name: 'Right', value: 0.09056 },
        { name: 'Signal', value: 0.08167 },
        { name: 'Parking', value: 0.07507 },
        { name: 'U Turn', value: 0.96966 },
        { name: 'Speed', value: 0.06749 },
      ],
    ];

    for (let datas of data) {
      this.drawBarChart(datas);
    }
  }
  drawBarChart(data) {
    const canvasHeight = 300;
    const canvasWidth = 400;
    const scale = 20;
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
    const svgCanvas = d3
      .select(this.refs.canvas)
      .append('svg')
      .attr('width', 800)
      .attr('height', 400)
      .style('border', '1px solid black');
    svgCanvas
      .append('g')
      .attr('fill', 'orange')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => x(i))
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => y(0) - y(d.value))
      .attr('width', x.bandwidth());

    svgCanvas
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (dataPoint, i) => i * 45 + 10)
      .attr('y', (dataPoint, i) => canvasHeight - dataPoint * scale - 10)
      .text((dataPoint) => dataPoint);
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
    svgCanvas.append('g').call(xAxis);

    svgCanvas.append('g').call(yAxis);
  }
  render() {
    return <div ref='canvas'></div>;
  }
}

const Results = () => {
  return (
    <div>
      <div class='left'>
        {/* <div class='centered'> */}
        <div className='container'>
          <div className='mg20'>
            <Typography variant='h5'>Upload Images to Test</Typography>
          </div>
          <UploadImages />
        </div>
        {/* </div> */}
      </div>

      <div class='right'>
        {/* <div class='centered'> */}
        <h1>Results</h1>
        <BarChart />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Results;
