import React from 'react'
import {
    Grid,
    Button
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
        }
    }

    handleActive = (value) => {
        this.setState({
            active: this.state.active + value
        })
    }

    render() {
        return (
            <div>
                <StepperControl active={this.state.active} />
                {
                    this.state.active === 0 &&
                    <Dir switch={this.handleActive} />
                }
                { this.state.active === 1 &&
                    <Grid style={{ marginTop: '10px' }} container>
                        <Button
                            variant="outlined"
                            style={{ marginLeft: '20px' }}
                            onClick={() => { this.handleActive(-1) }}
                        > Back </Button>
                        <Grid item xs={4} style={{ height: '500px', overflowY: 'scroll' }}>
                            <Controls />
                        </Grid>
                        <Grid item xs={8} style={{ height: '500px', overflowY: 'scroll' }}>
                            <ImageGrid />
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}