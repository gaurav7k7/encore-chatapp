import React, { useEffect, useState } from 'react';
import SidebarChat from './SidebarChat';
import './Sidebar.css';
import Avatar from '@mui/material/Avatar';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import app from './firebase';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import { useStateValue } from './StateProvider';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }] = useStateValue();
  const [newRoomName, setNewRoomName] = useState('');
  const db = getDatabase(app);

  // Function to create a new room
  const createRoom = () => {
    if (newRoomName.trim()) {
      const newRoomRef = push(ref(db, "rooms"));
      set(newRoomRef, { roomName: newRoomName })
        .then(() => {
          alert('Room created successfully');
          setNewRoomName('');  // Clear input after successful room creation
        })
        .catch((error) => {
          alert("Error creating room: " + error.message);
        });
    } else {
      alert("Room name cannot be empty.");
    }
  };

  // Fetch all rooms once on component mount
  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    onValue(roomsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Fetched rooms:", data);  // Debugging log
        const roomArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRooms(roomArray);
      } else {
        setRooms([]);  // No rooms found, set to empty array
      }
    }, (error) => {
      console.error("Error fetching rooms:", error);
      setRooms([]);  // Reset rooms to empty on error
    });
  }, [db]);

  return (
    <div className='sidebar'>
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton aria-label="Status">
            <DonutLargeOutlinedIcon />
          </IconButton>
          <IconButton aria-label="New chat">
            <ChatOutlinedIcon />
          </IconButton>
          <IconButton aria-label="More options">
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input 
            type="text" 
            placeholder="Enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <SidebarChat key={room.id} id={room.id} roomName={room.roomName} />
          ))
        ) : (
          <p>No rooms available</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
