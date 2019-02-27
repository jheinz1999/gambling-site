import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import PokerLobby from './components/PokerLobby';
import PokerWaitingRoom from './components/PokerWaitingRoom';
import PokerGame from './components/PokerGame';
import LandingPage from './components/LandingPage';
import BlackjackLobby from './components/BlackjackLobby';

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
          path='/'
          render={() => <LandingPage />}
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

        <Route
          exact
          path='/poker'
          render={props => <PokerLobby {...props} />}
        />

        <Route
          exact
          path='/poker/room/:name'
          render={props => <PokerWaitingRoom {...props} />}
        />

        <Route
          exact
          path='/poker/room/:name/play'
          render={props => <PokerGame {...props} />}
        />

        <Route
          exact
          path='/blackjack'
          render={props => <BlackjackLobby {...props} />}
        />

      </div>
    );
  }
}

export default App;
