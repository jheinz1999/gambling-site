import React from 'react';
import { connect } from 'react-redux';

import UsersList from './UsersList';
import Messenger from '../Messenger';

import './PokerWaitingRoom.scss';

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
      nonexistent: false,
      leaderID: null,
      startingGame: false

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

    if (!this.state.startingGame)
      this.props.socket.emit('leftRoom', this.props.match.params.name);

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

        this.setState({joined: true, users: room.users, leaderID: room.leaderID});

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

    socket.on('newLeader', id => this.setState({leaderID: id}));

    socket.on('startGame', () => {

      this.setState({startingGame: true}, () => this.props.history.push(`${this.props.location.pathname}/play`));

    });

  }

  startGame = () => {

    const { socket } = this.props;

    socket.emit('startGame', this.state.user.token);

  }

  render() {

    const { joined, nonexistent } = this.state;

    if (nonexistent)
      return <h1>The room you are trying to access does not exist.</h1>

    if (!joined)
      return <h1>Joining room...</h1>

    if (!this.state.user) {

      return <h1>loggin in yo</h1>

    }

    console.log(this.state.leaderID);

    return (

      <div className='poker-waiting-room'>

        <h1>{this.props.match.params.name}</h1>

        <UsersList
          users={this.state.users}
          user={this.state.user}
          leaderID={this.state.leaderID} />

        <Messenger />

        {this.state.leaderID === this.state.user.user_id
        && <button onClick={this.startGame} disabled={this.state.users.length === 1}>Start Game</button>}

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
