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
            active: localStorage.getItem('page') ? parseInt(localStorage.getItem('page')) : 0
        }
    }

    render() {
        const handleNext = () => {
            var act = this.state.active + 1
            localStorage.setItem('page', act)
            this.props.switch(act)
            this.setState({
                active: act
            })
        };

        const handleBack = () => {
            var act = this.state.active - 1
            localStorage.setItem('page', act)
            this.props.switch(act)
            this.setState({
                active: act
            })
        };

        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    disabled={this.state.active <= 0}
                >
                    Back
                </Button>
                <Stepper activeStep={this.state.active} style={{ width: '40%', padding: 0, marginLeft: '30px', marginRight:'30px' }}>
                    {this.steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={this.state.active >= this.steps.length - 1 || !this.props.flag()}
                >
                    Next
                </Button>
            </div>
        )
    }
}