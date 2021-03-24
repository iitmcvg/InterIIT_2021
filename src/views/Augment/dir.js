import React from 'react'
import {
    Paper,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    Checkbox,
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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
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
            filcol: '',
            filcon: '',
            filval: '',
            ordercol: '',
            orderval: '',
            dir2: [],
            checked: localStorage.getItem('dir') ? JSON.parse(localStorage.getItem('dir')) : []
        }
        this.process = process.bind(this)
        localStorage.setItem('page', 0)
    }
    getDirData = (data) => {
        const dum = Object.assign([], data)
        var order = dum.sort(function (a, b) { return a['num'] - b['num'] })
        var gmin = order[0]
        order.reverse()
        var gmax = order[0]

        this.setState({
            dir: data,
            dir2: data,
            gmax: gmax,
            gmin: gmin,
            lmax: gmax,
            lmin: gmin
        })
    }
    componentDidMount() {
        socket.on('dirlist', this.getDirData)
        socket.emit('dirlist')
    }
    componentWillUnmount() {
        socket.off('dirlist')
    }
    handleCheck = (event) => {
        var elem = event.target.getAttribute('aria-label')
        if (elem === "allCheck") {
            if (this.state.checked.length !== this.state.dir2.length) {
                var final = []
                for (var i = 0; i < this.state.dir2.length; i++)
                    final.push(this.state.dir2[i]['dir'])
                this.setState({
                    checked: final
                })
            }
            else
                this.setState({
                    checked: []
                })
        }
        else {
            var id = parseInt(elem.substring(5))
            var oldc = Object.assign([], this.state.checked)

            if (this.state.checked.includes(id)) {
                var loc = oldc.indexOf(id)

                var swap = oldc[oldc.length - 1]
                oldc[loc] = swap
                oldc[oldc.length - 1] = id

                oldc.pop()

                this.setState({
                    checked: oldc
                })
            }
            else {
                oldc.push(id)
                this.setState({
                    checked: oldc
                })
            }
        }
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
        var flag1 = true;
        var flag2 = true;

        if (this.state.filcol !== '') {
            if (this.state.filcon !== '' && this.state.filval === '') {
                alert('Fill the limiting value')
                flag1 = false
            }
            else if (this.state.filcon === '') {
                alert('Select the condition')
                flag1 = false
            }
        }
        if (this.state.ordercol !== '' && this.state.orderval === '') {
            alert('Select the sorting order')
            flag2 = false;
        }
        if (flag1 && flag2)
            this.process()
    }
    handleConfirm = () => {
        socket.emit("augsetdir", this.state.checked)
        localStorage.setItem('dir', JSON.stringify(this.state.checked))
        this.props.switch(1)
        this.props.setdir({ "dir": this.state.checked, "max": this.state.gmax })
    }

    render() {
        return (
            <Grid container style={{ marginTop: '10px' }} spacing={0} justify="center">
                <Grid item xs={3} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <Card style={{ padding: '30px', marginTop: '10px' }}>
                        <Typography>
                            Filter
                            {
                                this.state.filcol !== '' &&
                                <DeleteOutlinedIcon onClick={() => { this.setState({ filcol: '', filcon: '', filval: '' }) }} style={{ cursor: 'pointer', marginLeft: '200px' }} />
                            }
                        </Typography>
                        <FormControl component="fieldset" style={{ justifyContent: 'center' }}>
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
                        </FormControl>
                        <Typography style={{ marginTop: '30px' }}>
                            Sort
                            {
                                this.state.ordercol !== '' &&
                                <DeleteOutlinedIcon onClick={() => { this.setState({ ordercol: '', orderval: '' }) }} style={{ cursor: 'pointer', marginLeft: '200px' }} />
                            }
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
                        </FormControl>
                    </Card>
                    <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={this.handleClick}
                            disabled={this.state.orderval === '' && this.state.filval === ''}
                        > Apply </Button>
                        <Button
                            variant="outlined"
                            style={{ marginLeft: '20px' }}
                            onClick={() => { this.setState({ dir2: this.state.dir }) }}
                            disabled={this.state.dir === this.state.dir2}
                        > Reset </Button>
                    </div>
                </Grid>
                <Grid item xs={5} style={{ padding: '10px' }}>
                    <TableContainer component={Paper} style={{ maxHeight: '80vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        <Checkbox
                                            checked={this.state.checked.length === this.state.dir2.length}
                                            onChange={this.handleCheck}
                                            inputProps={{ 'aria-label': 'allCheck' }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>Dir</StyledTableCell>
                                    <StyledTableCell>Item</StyledTableCell>
                                    <StyledTableCell>Count</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state && this.state.dir2 && this.state.dir2.map((row, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCell>
                                            <Checkbox
                                                checked={this.state.checked.includes(row.dir)}
                                                onChange={this.handleCheck}
                                                inputProps={{ 'aria-label': `check${row.dir}` }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell component="th">{row.dir}</StyledTableCell>
                                        <StyledTableCell> {row.name} </StyledTableCell>
                                        <StyledTableCell>{row.num}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={4} style={{ maxHeight: '80vh', overflowY: 'auto', padding: '10px' }}>
                    <Card style={{ padding: '30px' }}>
                        {
                            this.state.gmax && this.state.gmin &&
                            <div>
                                <Typography>
                                    Global Maximum : {this.state.gmax['name']} ({this.state.gmax['num']})
                                </Typography>
                                <Typography>
                                    Global Minimum : {this.state.gmin['name']} ({this.state.gmin['num']})
                                </Typography>
                            </div>
                        }
                        {
                            this.state.lmax && this.state.lmin && (this.state.dir !== this.state.dir2) &&
                            <div>
                                <br />
                                <Typography>
                                    Local Maximum : {this.state.lmax['name']} ({this.state.lmax['num']})
                                </Typography>
                                <Typography>
                                    Local Minimum : {this.state.lmin['name']} ({this.state.lmin['num']})
                                </Typography>
                            </div>
                        }
                        <br />
                        {
                            this.state.checked.length === 0 &&
                            <Typography>
                                Please select a directory to resume
                            </Typography>
                        }
                        {
                            this.state.checked.length > 0 &&
                            <div>
                                <Typography>
                                    You have selected {this.state.checked.length === 1 ? "a directory" : `${this.state.checked.length} directories`}.
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginLeft: '20px' }}
                                        onClick={this.handleConfirm}
                                    > Confirm </Button>
                                </div>
                            </div>
                        }
                    </Card>
                </Grid>
            </Grid >
        )
    }
}