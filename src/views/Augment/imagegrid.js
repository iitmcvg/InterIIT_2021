import React from 'react'
import {
    Grid
} from '@material-ui/core'

import { socket } from '../../components/Socket'

export default class ImageGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            c: 0
        }
    }
    getData = (data) => {
        const blob = new Blob([data['img']], { type: 'image/png' })
        var newlist = []
        if (this.state.c === data['c'])
            newlist = this.state.images
        newlist.push(blob)
        this.setState({
            images: newlist,
            c: data['c']
        })
    }

    componentDidMount() {
        socket.on('augpreview', this.getData)
        socket.emit('augpreview', {})
    }
    componentWillUnmount() {
        socket.off('augpreview')
    }
    render() {
        return (
            <Grid container spacing={0} style={{ padding: '10px' }}>
                {
                    this.state.images && this.state.images.map((item, index) => {
                        return (
                            <Grid item key={index} style={{ flexBasis: '20%' }}>
                                <img
                                    src={URL.createObjectURL(item)}
                                    style={{
                                        position: 'inherit',
                                        height: '100%',
                                        width: '100%'
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