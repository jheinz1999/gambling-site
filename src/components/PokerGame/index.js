import React from 'react';
import { connect } from 'react-redux';

import ChatSystem from '../ChatSystem';
import cards from './Cards';

import './PokerGame.scss';

class PokerGame extends React.Component {

  constructor() {

    super();

    this.state = {

      joined: false,
      allReady: false,
      users: null,
      user: null,
      hand: null,
      cards: null,
      roomName: null

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

        console.log('room',room);
        this.setState({joined: true, users: room.users, roomName: room.name, cards: room.cards});
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

    const { joined, allReady, hand, roomName, users } = this.state;

    if (!joined)
      return <h1>Joining room...</h1>

    if (!allReady)
      return <h1>Waiting for players...</h1>

    if (!hand)
      return <h1>Dealing cards...</h1>

    return (

      <div className='poker-game'>

        <h1>{roomName}</h1>

        <div className='opponents'>

          { users.map(user => user.id !== this.props.user.user_id && (
            <div className='opponent'>

              <img src={user.img_url} alt='opponent' />
              <h2>{user.username}</h2>
              <p>${user.cash}</p>

            </div>
          )) }

        </div>

        <div className='table'>

          {this.state.cards.map(card => {

            if (card)
              return <img className='card' src={cards[`_${card.card}_${card.suit}`]} alt='playing card' />

            return <img className='card' src={cards['unknown']} alt='playing card' />

          })}

        </div>

        <div className='hand'>

          <h2>Your Hand</h2>

          <div className='cards'>

            {hand.map(card => {

              console.log(cards[`_${card.card}_${card.suit}`]);
              console.log(cards['_Q_D'], cards['_4_S']);

              return <img className='card' src={cards[`_${card.card}_${card.suit}`]} alt='playing card' />

            })}

          </div>

        </div>

        <ChatSystem />

      </div>

    );

  }

}

const stateToProps = state => {

  return {

    socket: state.socket,
    user: state.user

  }

}

export default connect(stateToProps, null)(PokerGame);
