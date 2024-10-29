import React, { useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    console.log("Current User State:", user);
  }, [user]); // Log user whenever it changes

  return (
    <div className='app'>
      {!user ? (
        <Login /> // If user is not authenticated, show the Login component
      ) : (
        <Router>
          <div className="app__body">
            <Sidebar /> 
            <Routes>
              <Route path="/" element={<Chat />} /> 
              <Route path="/rooms/:roomId" element={<Chat />} /> 
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;