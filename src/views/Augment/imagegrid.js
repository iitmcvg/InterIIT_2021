import React from 'react'
import {
    Grid
} from '@material-ui/core'

import { socket } from '../../components/Socket'

export default class ImageGrid extends React.Component {
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
            <Grid container spacing={0} justify="center">
                {
                    this.state.images && this.state.images.map((item, index) => {
                        return (
                            <Grid item xs={3} key={index}
                                style={{ height: 'fit-content', paddingBottom: '4px' }}>
                                <img
                                    src={URL.createObjectURL(item)}
                                    style={{
                                        position: 'inherit',
                                        height: '60%',
                                        width: '60%'
                                    }}
                                    alt={index}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>
        )
    }
}