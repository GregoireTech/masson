import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';

// Scripts
import checkNavigator from './helpers/checkNavigator';
// Components
import Start from './views/Start/Start';
import Room from './views/Room/Room';
import Browser from './views/Browser/Browser';


class App extends Component {

  render() {

    const valid = checkNavigator();

    return (
      <div className="App">
        {valid?  null :  <Browser/>}
        <Route path='/' exact component={Start} />
        <Route path='/boards/' component={Room} />
      </div>
    );
  }
}

export default App;
