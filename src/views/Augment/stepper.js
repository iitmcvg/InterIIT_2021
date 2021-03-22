import React from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button
} from '@material-ui/core'

export default class StepperControl extends React.Component {
    constructor(props) {
        super(props)
        this.steps = ['Select directory', 'Choose Augmentations', 'Summary']
        this.state = {
            active: this.props.active
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Stepper activeStep={this.state.active} style={{ width: '40%', padding: 0, marginLeft: '30px', marginRight: '30px' }}>
                    {this.steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        )
    }
}