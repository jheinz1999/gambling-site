import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">

        <Route
          path='/'
          render={() => <Navbar />}
        />


        <Route
          exact
          path='/login'
          render={props => <Login {...props} />}
        />

      </div>
    );
  }
}

export default App;
