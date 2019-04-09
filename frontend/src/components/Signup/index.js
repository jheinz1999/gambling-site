import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import config from '../../config';
import { updateUser } from '../../redux/actions';

import './Signup.scss';

class Signup extends React.Component {

  constructor() {

    super();

    this.state = {

      username: '',
      password: '',
      email: '',
      img: null,
      error: null

    }

  }

  handleChange = e => {

    this.setState({

      error: null,
      [e.target.name]: e.target.value

    });

  }

  handleSuccess = res => {

    localStorage.user = JSON.stringify(res.data);
    this.props.updateUser(res.data);
    this.props.history.push('/dashboard');

  }

  handleErr = err => {

    this.setState({error: err.response.message});

  }

  handleSubmit = e => {

    e.preventDefault();

    const formData = new FormData();

    formData.append('image', this.state.img);
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    formData.append('email', this.state.email);

    axios.post(`${config.SERVER_URL}/api/registration/register`, formData)
      .then(this.handleSuccess)
      .catch(this.handleErr);

  }

  render() {

    return (

      <form className='signup-form' onSubmit={this.handleSubmit}>

        <input type='text' name='username' placeholder='username' value={this.state.username} onChange={this.handleChange} autoComplete='off' required />
        <input type='email' name='email' placeholder='email' value={this.state.email} onChange={this.handleChange} autoComplete='off' required />
        <input type='password' name='password' placeholder='password' value={this.state.password} onChange={this.handleChange} required />
        <input type='file' accept='image/*' onChange={e => this.setState({img: e.target.files[0]})} />

        <button>Sign Up</button>

        {this.state.error && <p>{this.state.error}</p>}

      </form>

    );

  }

}

export default connect(null, { updateUser })(Signup);
