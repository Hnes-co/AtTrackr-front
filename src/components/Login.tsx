import React from 'react';
import { useState } from 'react';
import traveller from '../assets/traveller.png';
import { Link } from 'react-router-dom';
import {getUser} from '../services/index' ;
import {User} from '../interfaces';

interface Props {
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
}

const Login: React.FC<Props> = ({setUser}) => {

  const [username, setUsername] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin(event: any) {    
      event.preventDefault();   
      try {
        const user = await getUser({
          username, passwordHash,
        })
        console.log(user);
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        setUser(user);
      } catch (exception) {
        console.log(exception);
        setErrorMessage("Username or password was incorrect.");
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
        <div className="description-content">
          <div className="desc-item desc-item-map">
            <div>Keep track of places you have visited and plan your future travels</div>
            <div>Cities, Restaurants, Bars, Attractions - Save all your favourite places</div>
          </div>
        </div>
        <div className="login">
          <h1>Sign In</h1>
          <form className="login-form" onSubmit={handleLogin} >
            {errorMessage === '' ? null : <p className="errormessage">{errorMessage}</p>}
            <input className="login-form-input" placeholder="Username" value={username} onChange={({target}) => setUsername(target.value)} required></input>
            <input className="login-form-input" placeholder="Password" value={passwordHash} onChange={({target}) => setPassword(target.value)} type="password" required></input>
            <button className="login-form-submit" type="submit">Login</button>
          </form>
          <div className="login-links">
            <Link className="login-link" to="/signUp">Not a member yet?</Link>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login;