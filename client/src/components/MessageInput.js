import React, { useState } from "react";
import { SendHorizontal } from 'lucide-react';

function MessageInput({ onSendMessage, onTyping, onStopTyping }) {

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
        onTyping(); // 👈 typing signal bhejo
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSendMessage(message);
        onStopTyping();
        setMessage('');
    };

    return (
        <div className="message-input">
            <input
                type='text'
                placeholder='Type a message...'
                value={message}
                onChange={handleChange}  // 👈 handleChange use karo
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            <button onClick={handleSubmit}>
                <SendHorizontal size={14} /> Send
            </button>
        </div>
    );
}

export default MessageInput;