import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import config from '../../config';
import { updateUser } from '../../redux/actions';

import './Login.scss';

class Login extends React.Component {

  constructor() {

    super();

    this.state = {

      username: '',
      password: '',
      loginError: false

    }

  }

  handleChange = e => {

    this.setState({

      loginError: false,
      [e.target.name]: e.target.value

    });

  }

  handleSuccess = res => {

    localStorage.user = JSON.stringify(res.data);
    this.props.updateUser(res.data);
    this.props.history.push('/dashboard');

  }

  handleErr = res => {

    this.setState({loginError: true});

  }

  handleSubmit = e => {

    e.preventDefault();

    axios.post(`${config.SERVER_URL}/api/registration/login`, this.state)
      .then(this.handleSuccess)
      .catch(this.handleErr);

  }

  render() {

    return (

      <form className='login-form' onSubmit={this.handleSubmit}>

        <input type='text' name='username' placeholder='username' value={this.state.username} onChange={this.handleChange} autoComplete='off' required /> <br/>
        <input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.handleChange} required /> <br/>

        <button>Log In</button>

        {this.state.loginError && <p>Invalid credentials!</p>}

      </form>

    );

  }

}

export default connect(null, { updateUser })(Login);
