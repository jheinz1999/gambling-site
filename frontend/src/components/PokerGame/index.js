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
      roomName: null,
      pot: null,
      cash: null,
      bet: null,
      bets: null,
      turn: null

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

    socket.on('newCards', cards => this.setState({ cards }));

    socket.on('newPot', pot => this.setState({ pot }));

    socket.on('newBet', bet => this.setState({ bet }));

    socket.on('newBets', bets => this.setState({ bets }));

    socket.on('newTurn', turn => this.setState({ turn }));

    socket.on('newGameCash', cash => this.setState({ cash }));

    socket.on('room', room => {

      if (!room.users.find(user => user.username === this.state.user.username)) {

        console.error('you aint in this room foo');

      }

      else {

        console.log('room',room);
        this.setState({joined: true, users: room.users, roomName: room.name, cards: room.cards, pot: room.pot, cash: room.cash, userIndex: room.users.indexOf(room.users.find(user => user.id === this.props.user.user_id)), bet: room.bet});
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

  takeTurn(action, payload) {

    this.props.socket.emit('turnTaken', {
      action,
      payload,
      id: this.state.userIndex
    });

  }

  render() {

    const { joined, allReady, hand, roomName, users, cash, userIndex, bet, bets, turn } = this.state;

    console.log('turn', turn);

    if (!joined)
      return <h1>Joining room...</h1>

    if (!allReady)
      return <h1>Waiting for players...</h1>

    if (!bets)
      return <h1>Dealing cards...</h1>

    return (

      <div className='poker-game'>

        <h1>{roomName}</h1>

        <div className='status-display'>

          <h2>Your cash: <span>${cash[userIndex]}</span></h2>
          <h2>Current bet: <span>${bet}</span></h2>
          <h2>Your bet: <span>${bets[userIndex]}</span></h2>

        </div>

        <div className='opponents'>

          { users.map((user, i) => user.id !== this.props.user.user_id && (
            <div className='opponent'>

              <img src={user.img_url} alt='opponent' />
              <h2>{user.username}</h2>
              <p>${cash[i]}</p>
              <p>Current bet: ${bets[i]}</p>

            </div>
          )) }

        </div>

        <div className='table'>

          <div className='cards'>

            {this.state.cards.map(card => {

              if (card)
                return <img className='card' src={cards[`_${card.card}_${card.suit}`]} alt='playing card' />

              return <img className='card' src={cards['unknown']} alt='playing card' />

            })}

          </div>

          <p>Cash in pot: <span>${this.state.pot}</span></p>

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

          <div className='control-system'>

            <button disabled={turn !== userIndex} onClick={() => this.takeTurn('call')}>Call</button>
            <button disabled={turn !== userIndex} onClick={() => this.takeTurn('raise', 5)}>Raise</button>
            <button disabled={turn !== userIndex} onClick={() => this.takeTurn('fold')}>Fold</button>

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
