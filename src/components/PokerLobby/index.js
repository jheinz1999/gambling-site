import React from 'react';
import { connect } from 'react-redux';

import CreateRoomForm from '../CreateRoomForm';

class PokerLobby extends React.Component {

  constructor() {

    super();

    this.state = {

      verified: false,
      user: null,
      rooms: null

    }

  }

  componentDidMount() {

    if (!localStorage.user) {

      this.props.history.push('/login');

    }

    else {

      this.setState({
        user: JSON.parse(localStorage.user)
      }, this.setupSocket);

    }

  }

  setupSocket = () => {

    console.log(this.props);

    const { user } = this.state;
    const { history, socket } = this.props;

    socket.on('loginReq', () => {

      socket.emit('loginRes', user.token);

      socket.on('loginFailure', () => {

        console.log('FAILED');
        history.push('/login');

      });

      socket.on('loginSuccess', () => {

        this.setState({verified: true});

        socket.emit('getRooms');

        socket.on('roomList', rooms => {

          this.setState({rooms});

        });

      });

    });

    socket.on('error', data => {

      console.error(data);

    });

    socket.on('createRoomSuccess', room => {

      this.props.history.push(`/poker/room/${room}`)

    });

  }

  render() {

    const { verified, rooms } = this.state;

    if (!verified) {

      return <h1>Logging in...</h1>

    }

    if (!rooms) {

      return <h1>Fetching rooms...</h1>

    }

    return (

      <>

        <h1>Lobby</h1>

        <CreateRoomForm />

        {rooms.map(room => <p>{room.name}</p>)}

      </>

    )

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(PokerLobby);
