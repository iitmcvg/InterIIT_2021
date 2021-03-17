import React from 'react'
import {
    Slider, Typography
} from '@material-ui/core'

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
        const features = [
            {
                disp: "Scaling",
                name: "scale",
                min: 0,
                max: 1,
                step: 0.01,
                def: 0
            },
            {
                disp: "Rotating",
                name: "rotate",
                min: -359,
                max: 359,
                step: 1,
                def: 0
            },
        ]

        return (
            <div>
                <div style={{ padding: '10%', paddingLeft: '20%', paddingRight: '20%' }}>
                    {
                        features.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Typography>
                                        {item.disp} : {this.state && this.state[item.name]}
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
                                        marks={[{value: item.min, label: item.min}, {value: item.max, label: item.max} ]}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}