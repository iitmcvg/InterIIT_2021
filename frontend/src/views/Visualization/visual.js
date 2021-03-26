import React from 'react';
import { Grid } from '@material-ui/core';
import { socket } from '../../components/Socket';
import './results.css';

export default class VisualsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      occ_5: [],
      occ_2: [],
      block_1a: [],
      block_2a: [],
    };
  }
  getData = (data) => {
    const occ5Blob = new Blob([data['occ_5']], { type: 'image/png' });
    const occ2Blob = new Blob([data['occ_2']], { type: 'image/png' });
    const block1aBlob = new Blob([data['block_1a']], { type: 'image/jpg' });
    const block2aBlob = new Blob([data['block_2a']], { type: 'image/jpg' });
    const block52aBlob = new Blob([data['block_52a']], { type: 'image/jpg' });
    const block51aBlob = new Blob([data['block_52a']], { type: 'image/jpg' });

    var occ5 = [];
    var occ2 = [];
    var block1a = [];
    var block2a = [];
    var block51a = [];
    var block52a = [];

    occ5.push(occ5Blob);
    occ2.push(occ2Blob);
    block1a.push(block1aBlob);
    block2a.push(block2aBlob);
    block1a.push(block51aBlob);
    block2a.push(block52aBlob);

    this.setState({
      occ_5: occ5,
      occ_2: occ2,
      block_1a: block1a,
      block_2a: block2a,
      block_51a: block51a,
      block_52a: block52a,
    });
    console.log(this.state.matrixData);
  };

  componentDidMount() {
    socket.on('visualize', this.getData);
    socket.emit('visualize', {});
  }
  componentWillUnmount() {
    socket.off('visualize');
  }
  render() {
    return (
      <div>
        <Grid container spacing={0} style={{ padding: '10px' }}>
          {this.state.occ_5 &&
            this.state.occ_5.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Occlusion Map 5</h2>
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
          {this.state.occ_2 &&
            this.state.occ_2.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Occlusion Map 2</h2>
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

          {this.state.block_1a &&
            this.state.block_1a.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Activation Maximisation Map 1</h2>
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
          {this.state.block_2a &&
            this.state.block_2a.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Activation Maximization Map 2</h2>
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
          {this.state.block_52a &&
            this.state.block_52a.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Activation Maximization Map 3</h2>
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
          {this.state.block_52a &&
            this.state.block_52a.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Activation Maximization Map 4</h2>
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
      </div>
    );
  }
}
