import React from 'react'
import {
    Paper,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import { socket } from '../../components/Socket'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#E00420',
        fontSize: 20,
        color: theme.palette.common.white,
    },
    body: {
        fontFamily: 'Proxima Reg, sans-serif'
    },
}))(TableCell);

export default class Dir extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            canProceed: false
        }
    }
    getData = (data) => {
        this.setState({
            dir: data
        })
        console.table(data)
    }
    componentDidMount() {
        socket.on('dirlist', this.getData)
        socket.emit('dirlist')
    }
    componentWillUnmount() {
        socket.off('dirlist')
    }
    handleClick = () => {
        var newf = !this.state.canProceed
        this.props.switch(newf)
        this.setState({
            canProceed: newf
        })
    }

    render() {
        return (
            <Grid container spacing={0} style={{ padding: '5px' }}>
                <Grid item xs={6}>
                    <TableContainer component={Paper} style={{ width: '49vw', maxHeight: '80vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Directory name</StyledTableCell>
                                    <StyledTableCell>Item</StyledTableCell>
                                    <StyledTableCell>Count</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state && this.state.dir && this.state.dir.map((row, index) => (
                                    <TableRow key={row.name}>
                                        <StyledTableCell component="th">{index}</StyledTableCell>
                                        <StyledTableCell> {row.name} </StyledTableCell>
                                        <StyledTableCell>{row.num}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={6}>
                    
                    <button onClick={this.handleClick}> Mu </button>
                </Grid>
            </Grid>
        )
    }
}