import React from 'react';
import { connect } from 'react-redux';

import './PokerGame.scss';

class PokerGame extends React.Component {

  constructor() {

    super();

    this.state = {

      joined: false,
      allReady: false,
      users: null,
      user: null,
      hand: null

    }

  }

  componentDidMount() {

    this.setState({
      user: JSON.parse(localStorage.user),
      name: this.props.match.params.name
    }, this.setupSocket);

  }

  componentWillUnmount() {

    this.props.socket.emit('leftRoom', this.props.match.params.name);

    this.props.socket.off();

  }

  setupSocket() {

    const { socket } = this.props;

    socket.emit('roomReq', this.props.match.params.name);

    socket.on('room', room => {

      if (!room.users.find(user => user.username === this.state.user.username)) {

        console.error('you aint in this room foo');

      }

      else {

        this.setState({joined: true, users: room.users});
        socket.emit('readyToStart', this.state.user.user_id);

      }

    });

    socket.on('allReady', () => {

      this.setState({allReady: true});

    });

    socket.on('newHand', hand => {

      this.setState({hand});

    });

  }

  render() {

    const { joined, allReady, hand } = this.state;

    if (!joined)
      return <h1>Joining room...</h1>

    if (!allReady)
      return <h1>Waiting for players...</h1>

    if (!hand)
      return <h1>Dealing cards...</h1>

    return (

      <div className='poker-game'>

        <h1>poker</h1>

        <h2>Your Hand</h2>

        {hand.map(card => <p>{card.card} of {card.suit}</p>)}

      </div>

    );

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(PokerGame);