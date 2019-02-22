import openSocket from 'socket.io-client';

import config from '../config';

const initialState = {

  socket: openSocket(config.SERVER_URL)

}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    default:
      return state;

  }

}
