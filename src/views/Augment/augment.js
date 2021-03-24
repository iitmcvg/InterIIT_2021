import React from 'react'
import {
    Grid,
    Button,
    Typography,
    TextField
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
            dir: localStorage.getItem('dir') ? JSON.parse(localStorage.getItem('dir')) : [],
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
            checked: value['dir'],
            max: value['max']
        })
    }
    setOps = (value) => {
        this.setState({
            ops: value
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
                            <Controls switch={this.handleActive} setops={this.setOps} />
                        </Grid>
                        <Grid item xs={6} style={{ height: '80vh', overflowY: 'auto' }}>
                            <ImageGrid />
                        </Grid>
                    </Grid>
                }
                {
                    this.state.active === 2 &&
                    <div style={{ padding: '30px' }}>
                        <Typography style={{ margin: "auto", textAlign: 'center' }}>
                            You have selected {this.state.checked.length === 1 ? "a directory" : `${this.state.checked.length} directories`}.
                        </Typography>
                        <Typography style={{ margin: "auto", textAlign: 'center' }}>
                            Maximum number of images in a directory : {this.state.max['num']}.
                        </Typography>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                style={{ marginRight: '20px' }}
                                onClick={() => { this.handleActive(-1) }}
                            >Back</Button>
                            <TextField
                                id="standard-number"
                                label="Final num of images"
                                name="filval"
                                type="number"
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '20px' }}
                            > Confirm </Button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}