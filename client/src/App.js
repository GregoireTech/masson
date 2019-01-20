import React, { Component } from 'react';
import './App.css';

import Start from './views/start/start';
import Room from './views/Room/Room';

class App extends Component {
  state = {
    auth : true,
    room : true
  };
  render() {
    let body;
    if (this.state.auth && this.state.room != null) {
      body = <Room />
    } else {
      body = <Start />
    };


    
    return (
      <div className="App">
        {body}
      </div>
    );
  }
}

export default App;
