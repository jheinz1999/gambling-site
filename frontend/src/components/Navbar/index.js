import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateUser } from '../../redux/actions';

import './Navbar.scss';

function Navbar({user, updateUser}) {

  return (

    <nav>

      <div className='left-group'>

        <NavLink exact to='/' activeClassName='active'>Gambling Site</NavLink>

      </div>

      {user && (<div className='middle-group'>

        <NavLink exact to='/poker' activeClassName='active'>Play Poker</NavLink>
        <NavLink exact to='/blackjack' activeClassName='active'>Play Blackjack</NavLink>

      </div>)}

      <div className='right-group'>

        {user
        ?
        <Link to="/" onClick={() => {
          localStorage.clear();
          updateUser(null);
        }}>{user.username}: ${user.cash}</Link>
        :
        <><NavLink exact to='/login' activeClassName='active'>Log In</NavLink>
        <NavLink exact to='/signup' activeClassName='active'>Sign Up</NavLink></>}

      </div>

    </nav>

  );

}

const stateToProps = state => {
  return { user: state.user }
};

export default connect(stateToProps, { updateUser })(Navbar);
