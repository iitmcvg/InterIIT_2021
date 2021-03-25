import React, { Component } from 'react';
import {
  Button,
  // Box,
  // Typography,
  // withStyles,
  // LinearProgress
} from '@material-ui/core';
import { BoxLoading } from 'react-loadingg';
import './upload.css';

import BarChart from './barchart';
import PieBarChart from './pieChart';

import { socket } from '../../components/Socket';

// const BorderLinearProgress = withStyles((theme) => ({
//   root: {
//     height: 15,
//     borderRadius: 5,
//   },
//   colorPrimary: {
//     backgroundColor: '#EEEEEE',
//   },
//   bar: {
//     borderRadius: 5,
//     backgroundColor: '#1a90ff',
//   },
// }))(LinearProgress);
const pieData = [
  { name: 'speed (80)', value: '1500' },
  { name: 'speed (70)', value: '1200' },
  { name: 'speed (60)', value: '900' },
  { name: 'speed (50)', value: '800' },
  { name: 'speed (90)', value: '300' },
  { name: 'U Turn', value: '495' },
  { name: 'No Parking', value: '150' },
  { name: 'Signal1', value: '795' },
  { name: 'Signal 2', value: '540' },
  { name: 'Police', value: '122' },
  { name: 'Signal 3', value: '1100' },
  { name: 'Left', value: '340' },
  { name: 'Right', value: '640' },
  { name: 'Side', value: '874' },
];
// const barData = [
//   [
//     { name: 'E', value: 0.12702, title: 'Graph 1' },
//     { name: 'T', value: 0.09056 },
//     { name: 'A', value: 0.08167 },
//     { name: 'O', value: 0.07507 },
//     { name: 'I', value: 0.06966 },
//     { name: 'N', value: 0.06749 },
//     { name: 'S', value: 0.06327 },
//     { name: 'H', value: 0.06094 },
//     { name: 'R', value: 0.05987 },
//     { name: 'D', value: 0.04253 },
//     { name: 'L', value: 0.04025 },
//     { name: 'C', value: 0.02782 },
//     { name: 'U', value: 0.02758 },
//     { name: 'M', value: 0.02406 },
//     { name: 'W', value: 0.0236 },
//     { name: 'F', value: 0.02288 },
//     { name: 'G', value: 0.02015 },
//     { name: 'Y', value: 0.01974 },
//     { name: 'P', value: 0.01929 },
//     { name: 'B', value: 0.01492 },
//   ],
// ];
//   [
//     { name: 'Left', value: 0.92, title: 'Graph 2' },
//     { name: 'Right', value: 0.09056 },
//     { name: 'Signal', value: 0.08167 },
//     { name: 'Parking', value: 0.07507 },
//     { name: 'U Turn', value: 0.06966 },
//     { name: 'Speed', value: 0.06749 },
//   ],
//   [
//     { name: 'Left', value: 1, title: 'Graph 3' },
//     { name: 'Right', value: 0.09056 },
//     { name: 'Signal', value: 0.08167 },
//     { name: 'Parking', value: 0.07507 },
//     { name: 'U Turn', value: 0.96966 },
//     { name: 'Speed', value: 0.06749 },
//   ],
//   [
//     { name: 'Left', value: 0.04, title: 'Graph 4' },
//     { name: 'Right', value: 0.09056 },
//     { name: 'Signal', value: 0.08167 },
//     { name: 'Parking', value: 0.07507 },
//     { name: 'U Turn', value: 1 },
//     { name: 'Speed', value: 0.06749 },
//   ],
//   [
//     { name: 'Left', value: 0.06, title: 'Graph 5' },
//     { name: 'Right', value: 0.09056 },
//     { name: 'Signal', value: 0.1 },
//     { name: 'Parking', value: 0.07507 },
//     { name: 'U Turn', value: 0.96966 },
//     { name: 'Speed', value: 0.06749 },
//   ],
// ];
var barData = [];
// var isGraph = false;
class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      barData: [],
      pieData: [],
      graphOn: false,
      currentFile: undefined,
      previewImage: undefined,
      progress: 0,

      message: '',
      isError: false,
      loader: true,
    };
  }

  componentDidMount() {
    socket.on('predict', (data) => {
      // this.setState({ barData: data });
      // barData = data;
      console.log(data);
      barData = data;
      this.setState({ graphOn: true });
      // isGraph = true;
    });
  }

  selectFile(event) {
    this.setState({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: '',
    });
  }

  upload() {
    this.setState({
      progress: 0,
    });
    document.getElementById('loader').classList.remove('close');
    document.getElementById('loader').classList.add('open');
    console.log(this.state.currentFile);
    var fileReader = new FileReader();
    var file = this.state.currentFile;
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      var arrayBuffer = fileReader.result;
      // console.log(arrayBuffer);
      socket.emit('predict', arrayBuffer);
    };

    // this.getImgData();
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, 3000));
    setTimeout(() => {
      document.getElementById('loader').classList.remove('open');
      document.getElementById('loader').classList.add('close');
    }, 3000);
  }

  render() {
    const { currentFile, previewImage } = this.state;

    return (
      <div className='overall'>
        <div className='top grid-layout'>
          <div className='tile-left'>
            <div className='container'>
              <h5>Upload Images to Test</h5>
            </div>

            <div className='mg20'>
              <label htmlFor='btn-upload'>
                <input
                  id='btn-upload'
                  name='btn-upload'
                  style={{ display: 'none' }}
                  type='file'
                  accept='image/*'
                  onChange={this.selectFile}
                />
                <Button
                  className='btn-choose'
                  variant='outlined'
                  component='span'
                >
                  Choose Image
                </Button>
              </label>

              <Button
                className='btn-upload'
                color='primary'
                variant='contained'
                component='span'
                disabled={!currentFile}
                onClick={this.upload}
              >
                Upload
              </Button>
              <div id='loader' className='close'>
                <BoxLoading />
              </div>

              {previewImage && (
                <div>
                  <img className='preview my20' src={previewImage} alt='' />
                </div>
              )}
            </div>
          </div>
          <div className='tile-middle'>
            <h1>Results</h1>
          </div>
          <div className='tile-right'>
            <PieBarChart pieData={pieData} />
          </div>
        </div>
        <div className='bottom'>
          <div className='centered'>
            {this.state.graphOn && (
              <div className='grid-layout'>
                <BarChart barData={barData} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const Evaluation = () => {
  return (
    <div>
      <UploadImages />
    </div>
  );
};

export default Evaluation;
