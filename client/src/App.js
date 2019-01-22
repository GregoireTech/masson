import React, { Component } from 'react';
import './App.css';

import Start from './views/Start/Start';
import Room from './views/Room/Room';

class App extends Component {
  state = {
    auth : false,
    room: false
  };


  join(room){
    console.log('room set');
    const roomNumber = room;
    this.setState({room: roomNumber, auth : true});
  }

  render() {
    let body;
    if (this.state.auth && this.state.room) {
      body = (<Room room={this.state.room} />);
    } else {
      body = (<Start join={this.join.bind(this)}/> );
    }

    return (
      <div className="App">
      {body}
      </div>
    );
  }
}

export default App;
