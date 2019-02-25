import React from 'react';
import { connect } from 'react-redux';

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

      this.setState({messages: [...this.state.messages, data]});
      console.log('We gots a message', data);

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

        {this.state.messages.map(message => <p key={message.message}>{message.message}</p>)}

        <form onSubmit={this.sendMsg}>

          <input type='text' name='message' placeholder='message' value={this.state.message} onChange={this.handleChange} />
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
