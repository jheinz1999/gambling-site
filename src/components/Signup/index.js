import React from 'react';
import axios from 'axios';

import config from '../../config';

export default class Signup extends React.Component {

  constructor() {

    super();

    this.state = {

      username: '',
      password: '',
      email: '',
      error: null

    }


          console.log(config.SERVER_URL);

  }

  handleChange = e => {

    this.setState({

      error: null,
      [e.target.name]: e.target.value

    });

  }

  handleSuccess = res => {

    localStorage.user = JSON.stringify(res.data);
    this.props.history.push('/dashboard');

  }

  handleErr = err => {

    this.setState({error: err.response.message});

  }

  handleSubmit = e => {

    e.preventDefault();

    axios.post(`${config.SERVER_URL}/api/registration/register`, this.state)
      .then(this.handleSuccess)
      .catch(this.handleErr);

  }

  render() {

    return (

      <form onSubmit={this.handleSubmit}>

        <input type='text' name='username' placeholder='username' value={this.state.username} onChange={this.handleChange} required />
        <input type='email' name='email' placeholder='email' value={this.state.email} onChange={this.handleChange} required />
        <input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.handleChange} required />

        <button>Log In</button>

        {this.state.error && <p>{this.state.error}</p>}

      </form>

    );

  }

}
