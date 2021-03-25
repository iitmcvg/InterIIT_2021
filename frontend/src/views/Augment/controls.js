import React from 'react'
import {
    Button,
    Grid,
    Card,
    Typography,
    Slider,
} from '@material-ui/core'

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { list } from './controls_list'
import { socket } from '../../components/Socket'

export default class Controls extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange = (inp, val) => {
        if (inp && inp.target.parentNode.id) {
            var id = inp.target.parentNode.id
            this.setState({
                [id]: val
            })
        }
    }
    handleStateDelete = (name) => {
        var newst = this.state
        delete newst[name]
        this.setState(newst)
        socket.emit('augpreview', this.state)
    }

    render() {
        function valuetext(input) {
            return input
        }

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        style={{ marginLeft: '20px' }}
                        onClick={() => { this.props.switch(-1) }}
                    > Back </Button>
                    {
                        this.state &&
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '20px' }}
                            onClick={() => { this.props.setops(this.state); this.props.switch(1) }}
                            disabled={Object.keys(this.state).length === 0}
                        > Confirm </Button>
                    }
                    {
                        this.state &&
                        <Button
                            variant="outlined"
                            style={{ marginLeft: '20px' }}
                            onMouseEnter={() => { socket.emit('augpreview', {}) }}
                            onMouseLeave={() => { socket.emit('augpreview', this.state) }}
                            disabled={Object.keys(this.state).length === 0}
                        > Hover to Toggle</Button>
                    }
                </div>
                <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <Grid container style={{ padding: '10px' }}>
                        {
                            list.map((cat, i) => {
                                return (
                                    <Grid key={i} item xs={6} >
                                        <Card style={{ padding: '10%' }} variant="outlined">
                                            <Typography style={{ fontFamily: 'Proxima Reg, sans-serif', fontSize: '30px', color: '#E00420' }}>
                                                {cat['categ']}
                                            </Typography>
                                            <br />
                                            {
                                                cat['list'].map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Typography style={{ fontFamily: 'Proxima Reg, sans-serif' }}>
                                                                    {item.disp} : {this.state[item.name] && this.state[item.name]}{!this.state[item.name] && item.def}
                                                                </Typography>
                                                                {
                                                                    this.state[item.name] &&
                                                                    <DeleteOutlinedIcon onClick={() => { this.handleStateDelete(item.name) }} style={{ cursor: 'pointer' }} />
                                                                }
                                                            </div>
                                                            <Slider
                                                                getAriaValueText={valuetext}
                                                                aria-labelledby="discrete-slider-small-steps"
                                                                step={item.step}
                                                                defaultValue={item.def}
                                                                min={item.min}
                                                                max={item.max}
                                                                id={item.name}
                                                                value={typeof this.state[item.name] === 'number' ? this.state[item.name] : item.def}
                                                                onChange={this.handleChange}
                                                                onChangeCommitted={() => { socket.emit('augpreview', this.state); this.handleChange() }}
                                                                valueLabelDisplay="auto"
                                                                marks={[{ value: item.min, label: item.min }, { value: item.max, label: item.max }]}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
            </div>
        )
    }
}