import React, { Component } from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
  componentDidMount() {
    const data = [2, 4, 2, 6, 8, 12, 2.5, 5, 12, 6.6, 4.2, 5, 10, 1, 2, 7, 4];
    this.drawBarChart(data);
  }
  drawBarChart(data) {
    const canvasHeight = 400;
    const canvasWidth = 600;
    const scale = 20;

    const svgCanvas = d3
      .select(this.refs.canvas)
      .append('svg')
      .attr('width', 800)
      .attr('height', 400)
      .style('border', '1px solid black');
    svgCanvas
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', 40)
      .attr('height', (datapoint) => datapoint * scale)
      .attr('fill', 'orange')
      .attr('x', (datapoint, iteration) => iteration * 45)
      .attr('y', (datapoint) => canvasHeight - datapoint * scale);
    svgCanvas
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (dataPoint, i) => i * 45 + 10)
      .attr('y', (dataPoint, i) => canvasHeight - dataPoint * scale - 10)
      .text((dataPoint) => dataPoint);
  }
  render() {
    return <div ref='canvas'></div>;
  }
}

const Results = () => {
  return (
    <div>
      <h1>Results</h1>
      {/* <h3>Min is {d3.min(values)}</h3> */}
      <BarChart />
    </div>
  );
};

export default Results;
