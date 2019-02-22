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
      users: []

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

  setupSocket() {

    const { socket, history } = this.props;
    const { name } = this.state;

    socket.emit('usersReq');

    socket.on('loginFailure', () => {

      console.log('FAILED');
      history.push('/login');

    });

    socket.on('error', message => {

      console.error(message);

    });

    socket.on('users', users => {

      this.setState({users, joined: true});

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
