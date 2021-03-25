import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { socket } from '../../components/Socket';

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
      matrixData: data['matrix'],
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
                <Grid xs={4} item key={index} style={{ height: '50vh' }}>
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
          <Grid xs={8} style={{ marginTop: '20px' }}>
            <TableContainer
              style={({ height: '100vh' }, { overflowY: 'auto' })}
            >
              <Table stickyHeader component={Paper} aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Precision </StyledTableCell>
                    <StyledTableCell align='right'>Index</StyledTableCell>
                    <StyledTableCell align='right'>Recall</StyledTableCell>
                    <StyledTableCell align='right'>F1-Score</StyledTableCell>
                    <StyledTableCell align='right'>Support</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.matrixData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component='th' scope='row'>
                        {index}
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
        </Grid>
      </div>
    );
  }
}
