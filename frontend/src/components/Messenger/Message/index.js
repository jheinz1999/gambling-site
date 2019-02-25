import React from 'react';

import './Message.scss';

export default function Message({data}) {

  const { user, message } = data;

  return (

    <div className='message'>

      <p><strong>{user}</strong></p>
      <p>{message}</p>

    </div>

  );

}
