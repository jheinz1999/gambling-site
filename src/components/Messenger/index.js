import React from 'react';
import { connect } from 'react-redux';

import Message from './Message';

import './Messenger.scss';

class Messenger extends React.Component {

  constructor() {

    super();

    this.state = {

      messages: [],
      message: '',
      open: false,
      unread: 0

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

      this.setState({messages: [...this.state.messages, data], unread: this.state.open ? 0 : this.state.unread + 1}, () => {
        if (!this.props.onBottom || this.state.open) {

          const msgs = document.querySelector('.messages');
          msgs.scrollTop = msgs.scrollHeight;

        }
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

  renderNormal() {

    return (

      <div className='messenger'>

        <div className='messages'>

          {this.state.messages.map((message, id) => <Message key={id} data={message} />)}

        </div>

        <form className='submit-form' onSubmit={this.sendMsg}>

          <input type='text' name='message' placeholder='message' value={this.state.message} onChange={this.handleChange} autoComplete='off' />
          <button>Send</button>

        </form>

      </div>

    );

  }

  toggle = () => {

    this.setState({open: !this.state.open}, () => {

      if (this.state.open) {

        this.setState({ unread: 0 });
        const msgs = document.querySelector('.messages');
        msgs.scrollTop = msgs.scrollHeight;

      }

    });

  }

  renderBottom() {

    const { unread, open } = this.state;

    return (

      <div className='messenger-bottom'>

        {!open && (
          <div className='closed' onClick={this.toggle}><p>{unread === 0 ? 'Chat' : `Chat (${unread})`}</p></div>
        )}

        {open && (

          <div className='open'>

            <div className='top' onClick={this.toggle}><p>Chat</p></div>

            <div className='messages'>

              {this.state.messages.map((message, id) => <Message key={id} data={message} />)}

            </div>

            <form className='submit-form' onSubmit={this.sendMsg}>

              <input type='text' name='message' placeholder='message' value={this.state.message} onChange={this.handleChange} autoComplete='off' />
              <button>Send</button>

            </form>

          </div>

        )}

      </div>

    );

  }

  render() {

    return this.props.onBottom ? this.renderBottom() : this.renderNormal();

  }

}

const stateToProps = state => {

  return {

    socket: state.socket,
    username: state.user.username

  }

}

export default connect(stateToProps, null)(Messenger);
