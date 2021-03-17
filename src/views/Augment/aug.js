import React from 'react'
import {
    Grid
} from '@material-ui/core'

import StepperControl from './stepper'
import Controls from './controls'
import ImageGrid from './imagegrid'

import { socket } from '../../components/Socket'

export default class Augment extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            images: []
        }
    }

    getData = (data) => {
        if (typeof (data) === 'string') {
            alert(data)
            window.location.href = '/auth'
        }
        else {
            const blob = new Blob([data], { type: 'image/png' })
            var newlist = this.state.images
            newlist.push(blob)
            this.setState({
                images: newlist
            })
        }
    }

    componentDidMount() {
        socket.on('auglist', this.getData)
        socket.emit('auglist')
    }
    componentWillUnmount() {
        socket.off('auglist')
    }

    render() {
        return (
            <div>
                <StepperControl />
                <Grid container spacing={0}>
                    <Grid item xs={8}>
                        <Controls />
                    </Grid>
                    <Grid item xs={4}>
                        <ImageGrid images={this.state.images} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}