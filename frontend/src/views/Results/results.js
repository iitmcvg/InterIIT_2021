import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { socket } from '../../components/Socket';
import './results.css';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default class ResultsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      c: 0,
      matrixData: [],
      pca: [],
      full_acc: [],
      finetune_acc: [],
      full_loss: [],
      finetune_loss: [],
    };
  }
  getData = (data) => {
    const blob = new Blob([data['img']], { type: 'image/png' });
    const pcaBlob = new Blob([data['pca']], { type: 'image/png' });
    const fullaccBlob = new Blob([data['full_acc']], { type: 'image/png' });
    const fulllossBlob = new Blob([data['full_loss']], { type: 'image/png' });
    const fineLossBlob = new Blob([data['finetune_loss']], {
      type: 'image/png',
    });
    const fineaccBlob = new Blob([data['finetune_acc']], { type: 'image/png' });
    var newlist = [];
    var newPCA = [];
    var fullacc = [];
    var fullloss = [];
    var fineacc = [];
    var fineloss = [];

    if (this.state.c === data['c']) {
      newlist = this.state.images;
      newPCA = this.state.pca;
    }
    newlist.push(blob);
    newPCA.push(pcaBlob);
    fullacc.push(fullaccBlob);
    fullloss.push(fulllossBlob);
    fineacc.push(fineaccBlob);
    fineloss.push(fineLossBlob);
    this.setState({
      images: newlist,
      c: data['c'],
      matrixData: data['matrix'],
      pca: newPCA,
      full_acc: fullacc,
      finetune_acc: fineacc,
      full_loss: fullacc,
      finetune_loss: fineloss,
    });
    console.log(this.state.matrixData);
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
      <div>
        <Grid container spacing={0} style={{ padding: '10px' }}>
          {this.state.images &&
            this.state.images.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Confusion Matrix</h2>
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
          {this.state.pca &&
            this.state.pca.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>PCA Analysis</h2>
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
          {this.state.full_loss &&
            this.state.full_loss.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Full Loss Train</h2>
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
          {this.state.full_acc &&
            this.state.full_acc.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Full Acc Train</h2>
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
          {this.state.finetune_acc &&
            this.state.finetune_acc.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Fine Tune Acc</h2>
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
          {this.state.finetune_loss &&
            this.state.finetune_loss.map((item, index) => {
              return (
                <Grid item xs={6} key={index} className='heading'>
                  <h2>Fine Tune Loss</h2>
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
          <div style={{ padding: 20 }}>
            <Grid item xs={12} style={{ marginTop: '75px' }}>
              <h2>Classification Report</h2>
              <TableContainer
                style={({ height: '100vh' }, { overflowY: 'auto' })}
              >
                <Table stickyHeader component={Paper} aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Class Name </StyledTableCell>
                      <StyledTableCell align='right'>Precision</StyledTableCell>
                      <StyledTableCell align='right'>Recall</StyledTableCell>
                      <StyledTableCell align='right'>F1-Score</StyledTableCell>
                      <StyledTableCell align='right'>Support</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.matrixData.map((row, index) => (
                      <StyledTableRow key={row.SignName}>
                        <StyledTableCell component='th' scope='row'>
                          {row.SignName}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.precision}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.recall}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.f1_score}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.support}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </div>
        </Grid>
      </div>
    );
  }
}
