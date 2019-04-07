import React from 'react';
import { connect } from 'react-redux';

import './CreateForm.scss';

class CreateRoomForm extends React.Component {

  constructor() {

    super();

    this.state = {

      room: '',
      buyIn: 100

    }

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value
    });

  }

  handleSubmit = e => {

    const { socket } = this.props;
    const { room, buyIn } = this.state;

    e.preventDefault();

    const data = {

      room,
      buyIn: Number(buyIn),
      token: JSON.parse(localStorage.user).token

    }

    socket.emit('createRoom', data);

  }

  render() {

    return (

      <form className='create-form' onSubmit={this.handleSubmit}>

        <div className='elements'>

          <input type='text' name='room' onChange={this.handleChange} placeholder='room' required /><br/>
          <span>Buy in: </span>
          <select name='buyIn' onChange={this.handleChange} placeholder='100' required>

            <option value='100'>100</option>
            <option value='200'>200</option>
            <option value='200'>300</option>
            <option value='200'>400</option>
            <option value='200'>500</option>
            <option value='200'>600</option>
            <option value='200'>700</option>
            <option value='200'>800</option>
            <option value='200'>900</option>
            <option value='200'>1000</option>

          </select><br/>
          <button>Create room</button>

        </div>

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
