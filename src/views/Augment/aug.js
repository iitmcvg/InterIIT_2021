import React from 'react'
import {
    Grid
} from '@material-ui/core'

import Controls from '../../components/Controls'
import CardGrid from '../../components/CardGrid'
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
            <Grid container spacing={0}>
                <Grid item xs={8}>
                    <Controls />
                </Grid>
                <Grid item xs={4}>
                    <CardGrid images={this.state.images} />
                </Grid>
            </Grid>
        )
    }
}