import React, { useEffect } from 'react';
import './Login.css';
import Button from '@mui/material/Button';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth'; // Import signInWithPopup
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';

function Login() {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    signInWithPopup(auth, provider) // Use popup instead of redirect
      .then((result) => {
        console.log("User signed in:", result.user);
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => {
        console.error("Error during sign-in", error);
      });
  };

  return (
    <div className='login'>
      <div className="login__container">
        <img src="https://clipart-library.com/image_gallery2/WhatsApp-Transparent.png" alt="WhatsApp Logo" />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <Button variant="contained" onClick={signIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;