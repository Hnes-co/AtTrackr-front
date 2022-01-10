import React from 'react';
import { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import {createUser} from '../services/index' ;
import traveller from '../assets/traveller.png';

const SignUp = () => {

  const [username, setUsername] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleCreateUser(event: any) {    
    event.preventDefault();
    if(passwordHash.length > 5) {
      try {
        const result = await createUser({
          name, username, passwordHash,
        })
        console.log(result);
        setUsername('');
        setPassword('');
        setName('');
        setSuccess(true);
  
      } catch (exception) {
        setErrorMessage('Account creation failed, username already in use');
      }
    }
    else {
      setErrorMessage('Account creation failed, password must contain at least 6 characters.');
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
            {success 
            ? 
              <div className="signup-success">
                Account creation successful! 
                <div><Link className="signup-success-link" to="/">Login</Link></div>
              </div>
            :
              <>
                <h1>Sign Up</h1>
                <form className="login-form" onSubmit={handleCreateUser}>
                  {errorMessage === '' ? null : <p className="errormessage">{errorMessage}</p>}
                  <input className="login-form-input" placeholder="Name (Optional)" value={name} onChange={({target}) => setName(target.value)}></input>
                  <input className="login-form-input" placeholder="Username" required value={username} onChange={({target}) => setUsername(target.value)}></input>
                  <input className="login-form-input" placeholder="Password" required type="password" value={passwordHash} onChange={({target}) => setPassword(target.value)}></input>
                  <button className="login-form-submit">Create Account</button>
                </form>
                <Link className="login-link" to="/">Already have an account?</Link>
              </>
            }
          </div>
        </div>
    </div>
  );
};


export default SignUp;
