import React from 'react';

export default function Message({data}) {

  const { user, message } = data;

  return (

    <div className='message'>

      <p><strong>{user}</strong></p>
      <p>{message}</p>

    </div>

  );

}
