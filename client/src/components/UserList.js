import React from 'react';

function UserList({ users, currentUser, onPrivateMessage }) {
  return (
    <div className="user-list">
      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            onClick={() => {
              if (user.username !== currentUser) {
                onPrivateMessage(user);
              }
            }}
            style={{
              cursor: user.username !== currentUser ? 'pointer' : 'default'
            }}
          >
            🟢 {user.username}
            {user.username === currentUser && ' (You)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;