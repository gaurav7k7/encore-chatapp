import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import Avatar from '@mui/material/Avatar';
import { getDatabase, ref, set, push } from 'firebase/database';
import app from './firebase';
import { Link } from 'react-router-dom';

function SidebarChat({ id, roomName, addNewChat }) {
  const [seed, setSeed] = useState('');
  const db = getDatabase(app);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));

    // Debugging log
    console.log('Room Name:', roomName);
  }, [roomName]);

  const createChat = () => {
    const newRoomName = prompt('Please enter a room name for the chat');
    if (newRoomName) {
      const newRoomRef = push(ref(db, 'rooms'));
      set(newRoomRef, { roomName: newRoomName })
        .then(() => {
          alert('Room created successfully!');
        })
        .catch((error) => {
          alert('Error:', error.message);
        });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`} />
        <div className="sidebarChat__info">
          <h2>{roomName || 'Unnamed Room'}</h2> {/* Fallback for missing room name */}
          <p>message</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new chat</h2>
    </div>
  );
}

export default SidebarChat;