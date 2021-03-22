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
    TextField,
    Card,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Button
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import { socket } from '../../components/Socket'
import process from './process';

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
            canProceed: false,
            filcol: '',
            filcon: '',
            filval: '',
            ordercol: '',
            orderval: ''
        }
        this.process = process.bind(this)
    }
    getDirData = (data) => {
        this.setState({
            dir: data,
            dir2: data
        })
    }
    componentDidMount() {
        socket.on('dirlist', this.getDirData)
        socket.emit('dirlist')
    }
    componentWillUnmount() {
        socket.off('dirlist')
    }
    handleProceed = () => {
        var newf = !this.state.canProceed
        this.props.switch(newf)
        this.setState({
            canProceed: newf
        })
    }
    handleControls = (event) => {
        var type = event.target.getAttribute('name')
        if (type === "filcol")
            this.setState({
                "filcol": event.target.value,
                "filcon": ''
            })
        else
            this.setState({
                [event.target.getAttribute('name')]: event.target.value
            })
    }
    handleClick = () => {
        var flag1 = false;
        var flag2 = true;

        if (this.state.filcol !== '') {
            if (this.state.filcon !== '' && this.state.filval === '')
                alert('Fill the limiting value')
            else if (this.state.filcon === '')
                alert('Select the condition')
            else
                flag1 = true;
        }
        if (this.state.ordercol !== '' && this.state.orderval === '') {
            alert('Select the sorting order')
            flag2 = false;
        }
        if (flag1 && flag2)
            this.process()
    }

    render() {
        return (
            <Grid container style={{ marginTop: '10px' }} justify="center">
                <Grid item xs={7}>
                    <TableContainer component={Paper} style={{ maxHeight: '80vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Directory name</StyledTableCell>
                                    <StyledTableCell>Item</StyledTableCell>
                                    <StyledTableCell>Count</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state && this.state.dir2 && this.state.dir2.map((row, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCell component="th">{row.dir}</StyledTableCell>
                                        <StyledTableCell> {row.name} </StyledTableCell>
                                        <StyledTableCell>{row.num}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={3} style={{ marginLeft: '40px' }}>
                    <Card style={{ padding: '30px' }}>
                        <Typography>
                            Filter
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="filcol" name="filcol" value={this.state.filcol} onChange={this.handleControls}>
                                <FormControlLabel value="dir" control={<Radio />} label="Dir" />
                                <FormControlLabel value="item" control={<Radio />} label="Item" />
                                <FormControlLabel value="num" control={<Radio />} label="Count" />
                            </RadioGroup>
                            {
                                this.state.filcol === "item" &&
                                <RadioGroup row aria-label="filcon" name="filcon" value={this.state.filcon} onChange={this.handleControls}>
                                    <FormControlLabel value="substr" control={<Radio />} label="substring" />
                                </RadioGroup>
                            }
                            {
                                (this.state.filcol !== "item" && this.state.filcol !== '') &&
                                <RadioGroup row aria-label="filcon" name="filcon" value={this.state.filcon} onChange={this.handleControls}>
                                    <FormControlLabel value="lt" control={<Radio />} label="<" />
                                    <FormControlLabel value="gt" control={<Radio />} label=">" />
                                    <FormControlLabel value="leq" control={<Radio />} label="<=" />
                                    <FormControlLabel value="geq" control={<Radio />} label=">=" />
                                </RadioGroup>
                            }
                            {
                                (this.state.filcol === "item" && this.state.filcon) &&
                                <TextField
                                    id="standard-number"
                                    label="String"
                                    name="filval"
                                    type="text"
                                    variant="outlined"
                                    onChange={this.handleControls}
                                />
                            }
                            {
                                (!(this.state.filcol === "item") && this.state.filcon) &&
                                <TextField
                                    id="standard-number"
                                    label="Limit"
                                    name="filval"
                                    type="number"
                                    variant="outlined"
                                    onChange={this.handleControls}
                                />
                            }
                            {
                                this.state.filcol !== '' &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { this.setState({ filcol: '', filcon: '', filval: '' }) }}
                                >Reset</Button>
                            }
                        </FormControl>
                    </Card>
                    <br />
                    <Card style={{ padding: '30px' }}>
                        <Typography>
                            Sort
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="ordercol" name="ordercol" value={this.state.ordercol} onChange={this.handleControls}>
                                <FormControlLabel value="dir" control={<Radio />} label="Dir" />
                                <FormControlLabel value="item" control={<Radio />} label="Item" />
                                <FormControlLabel value="num" control={<Radio />} label="Count" />
                            </RadioGroup>
                            {
                                this.state.ordercol !== '' &&
                                <RadioGroup row aria-label="orderval" name="orderval" value={this.state.orderval} onChange={this.handleControls}>
                                    <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
                                    <FormControlLabel value="desc" control={<Radio />} label="Descending" />
                                </RadioGroup>

                            }
                            {
                                this.state.ordercol !== '' &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { this.setState({ ordercol: '', orderval: '' }) }}
                                >Reset</Button>
                            }
                        </FormControl>
                    </Card>
                    <br />
                    <div style={{ display: 'flex' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleClick}
                            disabled={this.state.orderval === '' && this.state.filval === ''}
                        > Process </Button>
                        {
                            this.state.dir !== this.state.dir2 &&
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '30px' }}
                                onClick={() => { this.setState({ dir2: this.state.dir }) }}
                            > Reset to Original</Button>
                        }
                    </div>
                </Grid>
            </Grid >
        )
    }
}