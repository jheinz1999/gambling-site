import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.scss';

export default function Navbar() {

  return (

    <nav>

      <div className='left-group'>

        <NavLink exact to='/' activeClassName='active'>Gambling Site</NavLink>

      </div>

      {localStorage.user && (<div className='middle-group'>

        <NavLink exact to='/poker' activeClassName='active'>Play Poker</NavLink>
        <NavLink exact to='/blackjack' activeClassName='active'>Play Blackjack</NavLink>

      </div>)}

      <div className='right-group'>

        <NavLink exact to='/login' activeClassName='active'>Log In</NavLink>
        <NavLink exact to='/signup' activeClassName='active'>Sign Up</NavLink>

      </div>

    </nav>

  );

}
