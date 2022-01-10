import React, {useEffect} from 'react';
import '../App.css';
import {User} from '../interfaces';
import UserProfile from './UserProfile';
import Login from './Login'

interface Props {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const Home: React.FC<Props> = ({user, setUser}) => {

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  if(window.localStorage.getItem('loggedUser') && user) {
    return (
      <UserProfile 
        user={user} 
        setUser={setUser} 
      >
      </UserProfile>
    )
  }
  else {
    return (
      <Login
        setUser={setUser}
      >
      </Login>
    );
  }
}

export default Home;
