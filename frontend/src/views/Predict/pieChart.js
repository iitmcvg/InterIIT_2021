import React from 'react';
import * as d3 from 'd3';

export default class PieBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.pieData,
    };
  }
  componentDidMount() {
    this.drawPieChart(this.state.data);
  }
  drawPieChart(data) {
    const width = 1500;
    const height = 800;
    const radius = (Math.min(width, height) / 2) * 0.8;
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);
    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

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
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .style('position', 'relative')
      .style('left', '10%');

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
      .attr('font-family', 'Proxima Reg')
      .attr('font-size', 20)
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
