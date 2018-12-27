import React from 'react';
const { ipcRenderer } = window.require('electron');

export default class Image extends React.Component {
  state = {
    imageUrl: '',
  };

  componentDidMount() {
    ipcRenderer.on('image', (event, arg) => {
      console.log('hello:', arg);
      this.setState({imageUrl: arg})
    })
  }

  render() {
    return (
      <img src={this.state.imageUrl} alt="Reddit Pic" style={{maxWidth: '100%'}} />
    );
  }
}