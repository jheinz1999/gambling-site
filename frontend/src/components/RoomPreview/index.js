import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './preview.scss';

function RoomPreview({name, users, leaderID, buyIn, history, socket}) {

  const data = {

    token: JSON.parse(localStorage.user).token,
    room: name

  }

  return (

    <div className='room-preview' onClick={() => {

      socket.emit('joinRoom', data);

      socket.on('joinSuccess', () => {

        history.push(`/poker/room/${name}`)

      });

    }}>

      <h2>{name}</h2>
      <p>{users.length}/5 connected</p>
      <p>buy in: {buyIn}</p>

    </div>

  );

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(withRouter(RoomPreview));
