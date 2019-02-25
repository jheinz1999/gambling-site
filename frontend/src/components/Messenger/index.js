import React from 'react';
import { connect } from 'react-redux';

import Message from './Message';

import './Messenger.scss';

class Messenger extends React.Component {

  constructor() {

    super();

    this.state = {

      messages: [],
      message: ''

    }

  }

  componentDidMount() {

    this.setupSocket();

  }

  componentWillUnmount() {

    this.props.socket.off();

  }

  setupSocket() {

    const { socket } = this.props;

    socket.on('newMsg', data => {

      this.setState({messages: [...this.state.messages, data]}, () => {
        const data = document.querySelector('.messages');
        data.scrollTop = data.scrollHeight;
      });

    });

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value
    });

  }

  sendMsg = e => {

    e.preventDefault();

    this.props.socket.emit('sendMsg', {
      user: this.props.username,
      message: this.state.message
    });

    this.setState({message: ''});

  }

  render() {

    return (

      <div className='messenger'>

        <div className='messages'>

          {this.state.messages.map(message => <Message data={message} />)}

        </div>

        <form  className='submit-form' onSubmit={this.sendMsg}>

          <input type='text' name='message' placeholder='message' value={this.state.message} onChange={this.handleChange} autoComplete='off' />
          <button>Send</button>

        </form>

      </div>

    );

  }

}

const stateToProps = state => {

  return {

    socket: state.socket

  }

}

export default connect(stateToProps, null)(Messenger);