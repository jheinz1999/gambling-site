import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';

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

        <Route
          exact
          path='/signup'
          render={props => <Signup {...props} />}
        />

      </div>
    );
  }
}

export default App;
