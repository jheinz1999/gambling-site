import openSocket from 'socket.io-client';

import config from '../config';

import { UPDATE_USER } from './actions';

const initialState = {

  socket: openSocket(config.SERVER_URL),
  user: localStorage.user ? JSON.parse(localStorage.user) : null

}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case UPDATE_USER:
      console.log('updated homie');
      return {...state, user: action.payload};

    default:
      return state;

  }

}
