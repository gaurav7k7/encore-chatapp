import React, { useEffect, useState } from 'react';
import './Chat.css';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, push, set, update, serverTimestamp } from 'firebase/database';
import app from './firebase';
import { useStateValue } from './StateProvider';

function Chat() {
  const [input, setInput] = useState('');
  const [seed, setSeed] = useState('');
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState('');
  const { roomId } = useParams();
  const db = getDatabase(app);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (roomId) {
      const roomRef = ref(db, `/rooms/${roomId}`);

      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          setRoomName(roomData.roomName);
          if (roomData.lastSeen) {
            setLastSeen(new Date(roomData.lastSeen).toLocaleString());
          }
        }
      });

      const messagesRef = ref(db, `rooms/${roomId}/messages`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesArray = Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setMessages(messagesArray);
        } else {
          setMessages([]); // If no messages exist, clear the messages array
        }
      });

      return () => unsubscribe();
    }
  }, [roomId, db]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const messageRef = push(ref(db, `rooms/${roomId}/messages`));
      const messageData = {
        message: input,
        name: user?.displayName,
        timestamp: serverTimestamp(),
      };

      set(messageRef, messageData);

      // Update only the lastSeen field in the room without overwriting room data
      update(ref(db, `/rooms/${roomId}`), {
        lastSeen: serverTimestamp(),
      });

      setInput(''); // Clear input after sending
    }
  };

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`} />
        <div className='chat__headerInfo'>
          <h3>{roomName}</h3>
          <p>Last seen {lastSeen || 'No messages yet'}</p>
        </div>
        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className='chat__body'>
        {messages.map((message) => (
          <p key={message.id} className={`chat__message ${message.name === user?.displayName ? 'chat__receiver' : ''}`}>
            <span className='chat__name'>{message.name}</span>
            {message.message}
            <span className='chat__timestamp'>
              {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        ))}
      </div>

      <div className='chat__footer'>
        <InsertEmoticonIcon />
        <form onSubmit={sendMessage}>
          <input
            type='text'
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='Type a message...'
          />
          <button type='submit'>Send message</button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;