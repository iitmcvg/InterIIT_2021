import React from 'react'
import {
    Grid,
    Card,
    Typography,
    Slider
} from '@material-ui/core'

import { list } from './controls_list'

export default class Controls extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange = (inp) => {
        var id = inp.target.parentNode.id
        var value = inp.target.getAttribute('aria-valuetext')
        this.setState({
            [id]: value
        })
    }

    render() {
        function valuetext(input) {
            return input
        }

        return (
            <Grid container style={{ padding: '10px' }}>
                {
                    list.map((cat, i) => {
                        return (
                            <Grid item xs={6} >
                                <Card key={i} style={{ padding: '10%' }} variant="outlined">
                                    <Typography style={{ fontFamily: 'Proxima Reg, sans-serif', fontSize: '30px', color: '#E00420' }}>
                                        {cat['categ']}
                                    </Typography>
                                    <br />
                                    {
                                        cat['list'].map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Typography style={{ fontFamily: 'Proxima Reg, sans-serif' }}>
                                                        {item.disp} : {this.state && this.state[item.name]}{!this.state && item.def}{this.state && !this.state[item.name] && item.def}
                                                    </Typography>
                                                    <Slider
                                                        getAriaValueText={valuetext}
                                                        aria-labelledby="discrete-slider-small-steps"
                                                        step={item.step}
                                                        defaultValue={item.def}
                                                        min={item.min}
                                                        max={item.max}
                                                        id={item.name}
                                                        onChangeCommitted={this.handleChange}
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
        )
    }
}