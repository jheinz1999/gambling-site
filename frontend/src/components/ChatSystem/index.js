import React from 'react';
import { connect } from 'react-redux';

class ChatSystem extends React.Component {

  render() {

    return (

      <div className='chat-box'>



      </div>

    )

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(ChatSystem);
