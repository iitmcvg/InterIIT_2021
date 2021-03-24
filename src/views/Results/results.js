import React from 'react';
import { Grid, Button } from '@material-ui/core';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: 0,
      accuracy: 0,
      images: [],
    };
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <Grid
          item
          xs={4}
          style={{ height: '500px', overflowY: 'scroll' }}
        ></Grid>
      </div>
    );
  }
}

export default Results;
