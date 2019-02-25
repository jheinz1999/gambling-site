import React from 'react';

export default function UsersList({users, user}) {

  console.log(users.length);

  return (

    <div className='users-list'>

      {users.map(u => <p key={u.username}>{u.username}</p>)}

    </div>

  );

}
