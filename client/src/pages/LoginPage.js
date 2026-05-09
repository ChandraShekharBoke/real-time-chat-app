import React, { useState } from 'react';
import { User } from 'lucide-react';
import { HouseWifi } from 'lucide-react';
import socket from '../socket';

function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    socket.emit('join', { username, room });
    setUser({ username, room });
  };

  return (
    <div className="login-container">

      <h1>Join Chat</h1>

      <label> <User size={16}/> Enter your username</label>
      <input
        type="text"
        placeholder='Enter your username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label> <HouseWifi size={16} /> Select a room </label>
      <select value={room} onChange={(e) => setRoom(e.target.value)}>

        <option value="general">General</option>
        <option value="gaming">Gaming</option>
        <option value="music">Music</option>

      </select>

      <button onClick={handleSubmit}>Join Room</button>

    </div>
  );
}

export default LoginPage;