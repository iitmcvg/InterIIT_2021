import React from 'react'
import {
    Grid,
    Button,
    Card,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@material-ui/core'

import { socket } from '../../components/Socket'
import BoxLoading from 'react-loadingg/lib/BoxLoading'

export default class Training extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    handleClick = () => {
        var pack = this.state
        delete pack['loading']
        socket.emit('train', pack)

        this.setState({
            loading: true
        })
    }
    handleControls = (event) => {
        var type = event.target.getAttribute('name')
        this.setState({
            [event.target.getAttribute('name')]: event.target.value
        })
    }
    getData = () => {
        alert('Training finished <3')
        this.setState({
            loading: false
        })
    }

    componentDidMount() {
        socket.on('train', this.getData)
    }
    componentWillUnmount() {
        socket.off('train')
    }

    render() {
        const wts = ['Pretrained weights', 'Best Weights', 'From scratch']
        var aug = ['Configured params', 'Default params', 'No augmentation']
        const model = ['EfficientNet', '2 Layer ConvNet', 'ResNet50']

        return (
            <Grid container spacing={0} justify='center'>
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Card style={{ padding: '30px', marginTop: '10px' }}>
                                <Typography style={{ textAlign: 'center', fontSize: '25px', color: '#e00420' }}>Weights</Typography>
                                <FormControl component="fieldset" style={{ justifyContent: 'center' }}>
                                    <RadioGroup row aria-label="filcol" name="weights" onChange={this.handleControls}>
                                        {
                                            wts.map((item, index) => {
                                                return (<FormControlLabel value={item} control={<Radio />} label={item} />)
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card style={{ padding: '30px', marginTop: '10px' }}>
                                <Typography style={{ textAlign: 'center', fontSize: '25px', color: '#e00420' }}>Augmentations</Typography>
                                <FormControl component="fieldset" style={{ justifyContent: 'center' }}>
                                    <RadioGroup row aria-label="filcol" name="aug" onChange={this.handleControls}>
                                        {
                                            aug.map((item, index) => {
                                                return (<FormControlLabel value={item} control={<Radio />} label={item} />)
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Card>
                            <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                                {
                                    !this.state.loading &&
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleClick}
                                        disabled={!this.state.weights || !this.state.aug || !this.state.model}
                                    > Start Training </Button>
                                }
                                {
                                    this.state.loading &&
                                    <BoxLoading />
                                }
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Card style={{ padding: '30px', marginTop: '10px' }}>
                                <Typography style={{ textAlign: 'center', fontSize: '25px', color: '#e00420' }}>Model</Typography>
                                <FormControl component="fieldset" style={{ justifyContent: 'center' }}>
                                    <RadioGroup row aria-label="filcol" name="model" onChange={this.handleControls}>
                                        {
                                            model.map((item, index) => {
                                                return (<FormControlLabel value={item} control={<Radio />} label={item} />)
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2} />
            </Grid>
        )
    }
}