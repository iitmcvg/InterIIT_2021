import React from 'react';
import { Grid } from '@material-ui/core';

import { socket } from '../../components/Socket';

export default class ResultsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      c: 0,
      data: [],
    };
  }
  getData = (data) => {
    const blob = new Blob([data['img']], { type: 'image/png' });
    var newlist = [];
    if (this.state.c === data['c']) newlist = this.state.images;
    newlist.push(blob);
    this.setState({
      images: newlist,
      c: data['c'],
    });
  };

  componentDidMount() {
    socket.on('results', this.getData);
    socket.emit('results', {});
  }
  componentWillUnmount() {
    socket.off('results');
  }
  render() {
    return (
      <Grid container spacing={0} style={{ padding: '10px' }}>
        {this.state.images &&
          this.state.images.map((item, index) => {
            return (
              <Grid xs={6} item key={index}>
                <img
                  src={URL.createObjectURL(item)}
                  style={{
                    position: 'inherit',
                    height: '100%',
                    width: '100%',
                  }}
                  alt={index}
                />
              </Grid>
            );
          })}
      </Grid>
    );
  }
}
