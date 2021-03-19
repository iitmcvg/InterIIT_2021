import React, { Component, useState } from 'react';
import {
  Button,
  // Box,
  // Typography,
  // withStyles,
  // LinearProgress
} from '@material-ui/core';
import { BoxLoading } from 'react-loadingg';

import { socket } from '../../components/Socket';
import { resolve } from 'q';

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

export default class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
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
      console.log(data);
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
      socket.emit('predict', {
        name: file.name,
        type: file.type,
        size: file.size,
        binary: arrayBuffer,
      });
    };
    this.getImgData();
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, 3000));
    // document.getElementById('loader').classList.remove('open');
    // document.getElementById('loader').classList.add('close');
  }
  getImgData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, 3000);
    });
  }

  render() {
    const { currentFile, previewImage } = this.state;

    return (
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
          <Button className='btn-choose' variant='outlined' component='span'>
            Choose Image
          </Button>
        </label>
        <div className='file-name'>{currentFile ? currentFile.name : null}</div>
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
        <div id='loader' class='close'>
          <BoxLoading />
        </div>

        {/* {currentFile && (
          <Box className='my20' display='flex' alignItems='center'>
            <Box width='100%' mr={1}>
              <BorderLinearProgress variant='determinate' value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography
                variant='body2'
                color='textSecondary'
              >{`${progress}%`}</Typography>
            </Box>
          </Box>
        )} */}

        {previewImage && (
          <div>
            <img className='preview my20' src={previewImage} alt='' />
          </div>
        )}

        {/* {message && (
          <Typography
            variant='subtitle2'
            className={`upload-message ${isError ? 'error' : ''}`}
          >
            {message}
          </Typography>
        )} */}
      </div>
    );
  }
}
