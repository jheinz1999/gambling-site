import React from 'react';

import './UsersList.scss';

export default function UsersList({users, user, leaderID}) {

  console.log(users.length);

  return (

    <div className='users-list'>

      <h2>Connected Users</h2>

      {users.map((u, id) => {

        let text = u.username;

        if (u.id === leaderID)
          text = '[leader] ' + text;

        else if (u.id === user.id)
          text = '* ' + text;

        return <p key={id}>{text}</p>

      })}

    </div>

  );

}
