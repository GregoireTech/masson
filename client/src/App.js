import React, { Component } from 'react';
import './App.css';

import Start from './views/start/start';
import Room from './views/Room/Room';

class App extends Component {
  state = {
    auth : true
  };

  teacher(){
    document.getElementById('userName').value = 'teacher'; 
    this.setState({auth: true});
  }
  student(){
    document.getElementById('userName').value = 'student'; 
    this.setState({auth: true});
  }

  render() {
    let body;
    if (this.state.auth) {
      body = <Room />
    } else {
      body = <Start teacher={this.teacher.bind(this)} student={this.student.bind(this)}/>
    };


    
    return (
      <div className="App">
      <input type='hidden' id='userName'/>
        {body}
      </div>
    );
  }
}

export default App;
