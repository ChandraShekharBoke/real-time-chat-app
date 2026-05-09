import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import { format } from 'date-fns';

function ChatPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [privateChat, setPrivateChat] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    socket.on('chatHistory', (history) => {
      setMessages(history.map((msg) => ({
        username: msg.username,
        text: msg.text,
        time: msg.time
      })));
    });

    socket.on('userTyping', ({ username }) => {
      setTypingUser(username);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser('');
      }, 2000);
    });

    socket.on('userStopTyping', () => {
      setTypingUser('');
    });

    socket.on('privateMessage', (messageData) => {
      setPrivateMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off('message');
      socket.off('roomData');
      socket.off('chatHistory');
      socket.off('userTyping');
      socket.off('userStopTyping');
      socket.off('privateMessage');
    };
  }, []);

  // 👈 Auto-scroll useEffect alag hai
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, privateMessages]);

  const handleSendMessage = (message) => {
  if (privateChat) {
    const msgData = {
      username: user.username,
      text: message,
      time: format(new Date(), 'hh:mm a')
    };
    socket.emit('privateMessage', {
      to: privateChat.socketId,
      from: user.username,
      text: message,
      time: msgData.time
    });
    // 👈 setPrivateMessages hata diya
  } else {
    socket.emit('sendMessage', {
      room: user.room,
      message: message
    });
  }
};

  const handleTyping = () => {
    socket.emit('typing', { room: user.room, username: user.username });
  };

  const handleStopTyping = () => {
    socket.emit('stopTyping', { room: user.room });
  };

  return (
    <div className="chat-container">

      <div className="sidebar">
        <h2>Online Users</h2>
        <UserList
          users={users}
          currentUser={user.username}
          onPrivateMessage={(selectedUser) => {
            setPrivateChat(selectedUser);
            setPrivateMessages([]);
          }}
        />
      </div>

      <div className="chat-main">

        {/* Header */}
        <div className="chat-header">
          {privateChat ? (
            <div>
              <span>💬 Private chat with {privateChat.username}</span>
              <button onClick={() => setPrivateChat(null)}>← Back to Room</button>
            </div>
          ) : (
            <span># {user.room} room</span>
          )}
        </div>

        {/* Messages */}
        <div className="message-list">
          {(privateChat ? privateMessages : messages).map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === user.username ? 'message-mine' : 'message-other'}`}
            >
              <div className="message-header">
                <div className="message-avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
                <span className="message-author">{msg.username}</span>
              </div>
              <div className="message-content">
                <div className="message-info">
                  <span className="message-text">{msg.text}</span>
                </div>
                <span className="message-time">{msg.time}</span>
                <hr className='message-divider'/>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 👈 auto-scroll */}
        </div>

        <div className="typing-indicator">
          {typingUser && !privateChat && <span>{typingUser} is typing...</span>}
        </div>

        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />

      </div>

    </div>
  );
}

export default ChatPage;