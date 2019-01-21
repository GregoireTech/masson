import React, { Component } from 'react';
import './App.css';

import Start from './views/start/start';
import Room from './views/Room/Room';

class App extends Component {
  state = {
    auth : false,
    socket: null, 
    room: null
  };

  componentDidMount(){
    const io = require('socket.io-client');
    const socket = io('http://localhost:8080/');
    // Setup Whiteboard
    this.setState({socket: socket});

  }

  componentDidUpdate(){
    
  }

  setRoom(){
    console.log('room set');
    const roomNumber = 333;
    this.setState({room: roomNumber});
  }

  render() {


    return (
      <div className="App">
        
        <Room room='222'/>
      </div>
    );
  }
}

export default App;
