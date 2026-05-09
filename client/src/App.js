import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

function App() {

    const [user, setUser] = useState(null);

    return (

        <BrowserRouter>

            <Routes>

                <Route path='/' element={
                    user ? <Navigate to='/chat' /> : <LoginPage setUser={setUser} />
                } />

                <Route path="/chat" element={
                    user ? <ChatPage user={user} /> : <Navigate to="/" />
                } />

            </Routes>

        </BrowserRouter>
    );
}

export default App;