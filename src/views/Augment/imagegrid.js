import React from 'react'
import {
    Grid
} from '@material-ui/core'

export default class ImageGrid extends React.Component {
    render() {
        return (
            <Grid container spacing={0} justify="center">
                {
                    this.props.images && this.props.images.map((item, index) => {
                        return (
                            <Grid item xs={3} key={index} 
                                style={{ height: 'fit-content', paddingBottom: '4px'}}>
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