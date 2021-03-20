import React from 'react'
import {
    Grid
} from '@material-ui/core'

import StepperControl from './stepper'
import Dir from './dir'
import Controls from './controls'
import ImageGrid from './imagegrid'


export default class Augment extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            images: [],
            active: localStorage.getItem('page') ? parseInt(localStorage.getItem('page')) : 0,
            canProceed: false
        }
        this.setActive = this.setActive.bind(this)
        this.getProceed = this.getProceed.bind(this)
    }

    getProceed = () => {
        return this.state.canProceed
    }
    setProceed = (flag) => {
        this.setState({
            canProceed: flag
        })
    }

    setActive = (flag) => {
        this.setState({
            active: flag,
            canProceed: false
        })
    }

    render() {
        return (
            <div>
                <StepperControl switch={this.setActive} flag={this.getProceed} />
                {
                    this.state.active === 0 &&
                    <Dir switch={this.setProceed} />
                }
                { this.state.active === 1 &&
                    <Grid style={{ marginTop: '10px' }} container>
                        <Grid item xs={6}>
                            <Controls switch={this.setProceed} />
                        </Grid>
                        <Grid item xs={6} style={{ height: '500px', overflowY: 'scroll' }}>
                            <ImageGrid />
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}