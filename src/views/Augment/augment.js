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

import { socket } from '../../components/Socket'

export default class Augment extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            images: [],
            active: localStorage.getItem('max') ? parseInt(localStorage.getItem('page')) : 0,
            dir: localStorage.getItem('dir') ? JSON.parse(localStorage.getItem('dir')) : [],
            max: localStorage.getItem('max') ? parseInt(localStorage.getItem('max')) : 0,
        }
        this.setDir = this.setDir.bind(this)
        this.setOps = this.setOps.bind(this)
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
            dir: value['dir'],
            max: value['max']['num']
        })
        localStorage.setItem('max', value['max']['num'])
    }
    setOps = (value) => {
        this.setState({
            ops: value
        })
    }
    handleFinalClick = () => {
        var flag = true
        if (!this.state.finalnum) {
            alert('Enter num plz')
            flag = false
        }
        if (!this.state.ops) {
            alert('Re-select the operations plz')
            flag = false
            this.handleActive(-1)
        }
        if (flag) {
            socket.emit('augment', { "file": this.state.filename, "data": { "dir": this.state.dir, "ops": this.state.ops, "num": this.state.finalnum } })
            alert('Config saved :)')
            window.location.href = '/'
            localStorage.removeItem('page')
            localStorage.removeItem('dir')
            localStorage.removeItem('max')
        }
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
                        <Typography style={{ textAlign: 'center' }}>
                            You have selected {this.state.dir.length === 1 ? "a directory" : `${this.state.dir.length} directories`}.
                        </Typography>
                        <Typography style={{ textAlign: 'center' }}>
                            Maximum number of images in a directory : {this.state.max}.
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
                                type="number"
                                variant="outlined"
                                onChange={(e) => { this.setState({ finalnum: e.target.value }) }}
                            />
                            <TextField
                                label="File name without extension"
                                type="text"
                                variant="outlined"
                                style={{ marginLeft: '20px' }}
                                onChange={(e) => { this.setState({ filename: e.target.value }) }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '20px' }}
                                onClick={this.handleFinalClick}
                                disabled={!this.state.finalnum || !this.state.filename}
                            > Confirm </Button>
                        </div>
                        {
                            this.state.finalnum && this.state.finalnum > this.state.max &&
                            <Typography style={{ textAlign: 'center' }}>
                                {`It's preferable to keep final number <= global maximum`}
                            </Typography>
                        }
                    </div>
                }
            </div>
        )
    }
}