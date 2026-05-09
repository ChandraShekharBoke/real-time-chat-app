function MessageList({ typingUser }) {

    return (

        <div className="message-list">

            <div className="message">

                <span className="message-author">User 1</span>

                <span className="message-text">Hello everyone!</span>

            </div>

            <div className="typing-indicator">
                {typingUser && <span>{typingUser} is typing...</span>}
            </div>

            <div className="message">

                <span className="message-author">User-2</span>

                <span className="message-text">Hi there!</span>

            </div>

              <div ref={messagesEndRef} />

        </div>
    );
}

export default MessageList;