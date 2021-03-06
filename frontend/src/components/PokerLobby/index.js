import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import CreateRoomForm from '../CreateRoomForm';
import RoomPreview from '../RoomPreview';

import { updateUser, updateCash } from '../../redux/actions';
import config from '../../config';

import './PokerLobby.scss';

class PokerLobby extends React.Component {

  constructor() {

    super();

    this.state = {

      verified: false,
      rooms: null

    }

  }

  componentDidMount() {

    if (!this.props.user) {

      this.props.history.push('/login');

    }

    else {

      axios.get(`${config.SERVER_URL}/api/registration/userInfo`, {
        headers: {
          Authorization: this.props.user.token
        }
      }).then(res => {

        this.props.updateCash(res.data.cash);
        this.setupSocket();
        console.log(this.props.user);

      });

    }

  }

  componentWillUnmount() {

    this.props.socket.off();

  }

  setupSocket = () => {

    const { history, socket, user } = this.props;

    socket.emit('loginRes', user.token);
    socket.emit('getRooms');

    console.log('emittted requests');

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

    socket.on('cashChange', cash => {

      this.props.updateCash(cash);

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

      <div className='poker-lobby'>

        <h1>Lobby</h1>

        <CreateRoomForm />

        {rooms.map((room, id) => !room.playing && <RoomPreview {...room} key={id} />)}

      </div>

    )

  }

}

const stateToProps = state => {

  return {

    socket: state.socket,
    user: state.user

  }

}

export default connect(stateToProps, { updateUser, updateCash })(PokerLobby);
