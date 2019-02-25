import React from 'react';
import { connect } from 'react-redux';

import CreateRoomForm from '../CreateRoomForm';
import RoomPreview from '../RoomPreview';

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

  componentWillUnmount() {

    this.props.socket.off();

  }

  setupSocket = () => {

    const { user } = this.state;
    const { history, socket } = this.props;

    socket.emit('loginRes', user.token);
    socket.emit('getRooms');

    socket.on('loginFailure', () => {

      console.log('FAILED');
      history.push('/login');

    });

    socket.on('loginSuccess', () => {

      this.setState({verified: true});

    });

    socket.on('error', data => {

      console.error(data);

    });

    socket.on('createRoomSuccess', room => {

      this.props.history.push(`/poker/room/${room}`)

    });

    socket.on('roomList', rooms => {

      console.log('got it');

      this.setState({rooms});

    });

  }

  render() {

    const { verified, rooms } = this.state;

    if (!verified) {

      return <h1>Logging in...</h1>

    }

    if (rooms === null) {

      return <h1>Fetching rooms...</h1>

    }

    return (

      <>

        <h1>Lobby</h1>

        <CreateRoomForm />

        {rooms.map(room => <RoomPreview {...room} key={room.name} />)}

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
