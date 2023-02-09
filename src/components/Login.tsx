import React, { FormEvent } from 'react';
import { useState, useRef } from 'react';
import traveller from '../assets/traveller.png';
import { Link } from 'react-router-dom';
import { getUser, getVisits } from '../services/index';
import { User, Visits } from '../interfaces';

interface Props {
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setVisits: React.Dispatch<React.SetStateAction<Visits | undefined>>;
}

const Login: React.FC<Props> = ({ setUser, setVisits }) => {

  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [infoMessage, setInfoMessage] = useState('');

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const username = userNameRef.current?.value ?? "";
    const passwordHash = passwordRef.current?.value ?? "";
    try {
      const user = await getUser({
        username, passwordHash
      });
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      const visits = await getVisits(user._id);
      window.localStorage.setItem("userVisits", JSON.stringify(visits));
      setVisits(visits);
    } catch(exception) {
      setInfoMessage("Username or password was incorrect.");
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
            <label className="message-error">{infoMessage}</label>
            <input className="login-form-input" placeholder="Username" ref={userNameRef} required />
            <input className="login-form-input" placeholder="Password" ref={passwordRef} type="password" required />
            <button className="login-form-submit" type="submit">Login</button>
          </form>
          <div className="login-links">
            <Link className="login-link" to="/signUp">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;