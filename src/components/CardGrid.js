import React from 'react'
import {
    Grid
} from '@material-ui/core'
export default class CardGrid extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Grid container spacing={0} justify="center">
                {
                    this.props.images && this.props.images.map((item, index) => {
                        return (
                            <Grid item xs={2} key={index} 
                                style={{ height: 'fit-content', flexBasis:'20%' }}>
                                <img
                                    src={URL.createObjectURL(item)}
                                    style={{
                                        position: 'inherit',
                                        height: '60%',
                                        width: '60%'
                                    }}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>
        )
    }
}