import React from 'react';
import * as d3 from 'd3';

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.barData,
    };
  }
  componentDidMount() {
    const data = this.state.data;

    console.log(data.length);
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
      .append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', (d, i) => x(i) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value))
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
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
