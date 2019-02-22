import React from 'react';
import { connect } from 'react-redux';

class CreateRoomForm extends React.Component {

  constructor() {

    super();

    this.state = {

      room: ''

    }

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value
    });

  }

  handleSubmit = e => {

    const { socket } = this.props;
    const { room } = this.state;

    e.preventDefault();

    const data = {

      room,
      token: JSON.parse(localStorage.user).token

    }

    socket.emit('createRoom', data);

  }

  render() {

    return (

      <form onSubmit={this.handleSubmit}>

        <input type='text' name='room' onChange={this.handleChange} placeholder='room' required />
        <button>Create room</button>

      </form>

    );

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(CreateRoomForm);
