import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios.get("https://reddit.com/r/iamverysmart.json").then(response => this.setState({
      posts: response.data.data.children,
    })).catch(error => {
      console.log("Error: ", error);
    });
  }

  showImage = () => ipcRenderer.send('toggle-image');

  render() {
    return (
      <div className="App">
        <ul className="list-group list-group-flush">
          {this.state.posts.map(post => (
            <li
              key={post.data.id}
              className="list-group-item flex-container"
              onClick={this.showImage}
            >
              <img src={post.data.thumbnail} alt="thumb" className="thumbnail" />d
              <div>{post.data.title}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
