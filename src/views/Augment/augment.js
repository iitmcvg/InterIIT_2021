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
            dir: localStorage.getItem('dir') ? JSON.parse(localStorage.getItem('dir')) : []
        }
    }

    handleActive = (value) => {
        var newa = this.state.active + value
        this.setState({
            active: newa
        })

        localStorage.setItem('page', newa)
    }
    setDir = (value) => {
        this.setState({
            dir: value
        })
    }

    render() {
        return (
            <div>
                <StepperControl active={this.state.active} key={this.state.active} />
                {
                    this.state.active === 0 &&
                    <Dir switch={this.handleActive} setdir={this.setDir} />
                }
                {
                    this.state.active === 1 &&
                    <Grid style={{ marginTop: '10px' }} container>
                        <Grid item xs={6} style={{ height: '80vh' }}>
                            <Controls switch={this.handleActive} />
                        </Grid>
                        <Grid item xs={6} style={{ height: '80vh', overflowY: 'auto' }}>
                            <ImageGrid />
                        </Grid>
                    </Grid>
                }
                {
                    this.state.active === 2 &&
                    <Button onClick={()=>{this.handleActive(-1)}}>Back</Button>
                }
            </div>
        )
    }
}