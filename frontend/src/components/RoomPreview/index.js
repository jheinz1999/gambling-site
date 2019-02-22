import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function RoomPreview({name, users, leaderID, history, socket}) {

  const data = {

    token: JSON.parse(localStorage.user).token,
    room: name

  }

  return (

    <div className='room-preview'>

      <h2>{name}</h2>
      <p>{users.length}/5 connected</p>
      <button onClick={() => {

        socket.emit('joinRoom', data);

        socket.on('joinSuccess', () => {

          history.push(`/poker/room/${name}`)

        });

      }}>Join Room</button>

    </div>

  );

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(withRouter(RoomPreview));
