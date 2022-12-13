import React from 'react';
import { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { createUser } from '../services/index';
import traveller from '../assets/traveller.png';

const SignUp: React.FC = () => {

  const [username, setUsername] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState({ type: '', message: '' });

  async function handleCreateUser(event: any) {
    event.preventDefault();
    try {
      await createUser({
        name, username, passwordHash,
      });
      setUsername('');
      setPassword('');
      setName('');
      setMessage({ type: 'success', message: 'Account creation successfull! You can now login.' });

    } catch(exception) {
      setMessage({ type: 'error', message: 'Account creation failed, username already in use' });
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-image">
          <img src={traveller} alt="traveller.png"></img>
        </div>
        <h1 className="header-title">AtTrackr</h1>
        <h3>Tracking your travels</h3>
      </div>
      <div className="login-content">
        <div className="login">
          <h1>Sign Up</h1>
          <form className="login-form" onSubmit={handleCreateUser}>
            <div className={"message-" + message.type}>{message.message}</div>
            <input className="login-form-input" placeholder="Name (Optional)" value={name} onChange={({ target }) => setName(target.value)}></input>
            <input className="login-form-input" placeholder="Username" required value={username} onChange={({ target }) => setUsername(target.value)}></input>
            <input className="login-form-input" placeholder="Password" required minLength={6} type="password" value={passwordHash} onChange={({ target }) => setPassword(target.value)}></input>
            <button type="submit" className="login-form-submit">Create Account</button>
          </form>
          <Link className="login-link" to="/">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
