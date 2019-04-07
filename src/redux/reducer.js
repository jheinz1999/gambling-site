import openSocket from 'socket.io-client';

import config from '../config';

import { UPDATE_USER, UPDATE_CASH } from './actions';

const initialState = {

  socket: openSocket(config.SERVER_URL),
  user: localStorage.user ? JSON.parse(localStorage.user) : null

}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case UPDATE_USER:
      console.log('updated homie');
      return {...state, user: action.payload};

    case UPDATE_CASH:
      const user = Object.assign({}, state.user);
      user.cash = action.payload;
      return {...state, user}

    default:
      return state;

  }

}
