import React from 'react';
import { connect } from 'react-redux';

import UsersList from '../UsersList';

class PokerWaitingRoom extends React.Component {

  constructor() {

    super();

    this.state = {

      name: null,
      room: null,
      chatLog: null,
      user: null,
      joined: false,
      users: [],
      nonexistent: false

    }

  }

  componentDidMount() {

    if (!localStorage.user) {

      this.props.history.push('/login');

    }

    else {

      this.setState({
        user: JSON.parse(localStorage.user),
        name: this.props.match.params.name
      }, this.setupSocket);

    }

  }

  componentWillUnmount() {

    this.props.socket.emit('left', this.props.user.username);
    this.props.socket.off();

  }

  setupSocket() {

    const { socket, history } = this.props;
    const { name } = this.state;

    socket.emit('roomReq', this.props.match.params.name);

    socket.on('nonexistentRoom', () => {

      this.setState({nonexistent: true});

    });

    socket.on('room', room => {

      if (!room.users.find(user => user.username === this.state.user.username)) {

        console.error('you aint in this room foo');

      }

      else {

        this.setState({joined: true, users: room.users});

      }

    });

    socket.on('loginFailure', () => {

      console.log('FAILED');
      history.push('/login');

    });

    socket.on('error', message => {

      console.error(message);

    });

    socket.on('users', users => {

      this.setState({users});

      if (!users.find(user => user.username === this.state.user.username)) {

        console.error('YOURE NOT HERE BUD');

      }

    });

    socket.on('newUser', user => console.log('new user', user));

  }

  render() {

    const { joined } = this.state;

    if (!joined)
      return <h1>Joining room...</h1>

    return (

      <div className='poker-waiting-room'>

        <UsersList
          users={this.state.users}
          user={this.state.user} />

      </div>

    );

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(PokerWaitingRoom);