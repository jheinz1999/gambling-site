import React from 'react';
import openSocket from 'socket.io-client';

import config from '../../config';

export default class PokerLobby extends React.Component {

  constructor() {

    super();

    this.state = {

      socket: null,
      verified: false,
      user: null

    }

  }

  componentDidMount() {

    if (!localStorage.user) {

      this.props.history.push('/login');

    }

    else {

      this.setState({
        socket: openSocket(config.SERVER_URL),
        user: JSON.parse(localStorage.user)
      }, this.setupSocket);

    }

  }

  setupSocket = () => {

    const { socket, user } = this.state;
    const { history } = this.props;

    socket.on('loginReq', () => {

      socket.emit('loginRes', user.token);

      socket.on('loginFailure', () => {

        console.log('FAILED');
        history.push('/login');

      });

      socket.on('loginSuccess', () => {

        this.setState({verified: true});

      });

    });

  }

  render() {

    if (!this.state.verified) {

      return <h1>Logging in...</h1>

    }

    return (

      <>

        <h1>Lobby</h1>

      </>

    )

  }

}
