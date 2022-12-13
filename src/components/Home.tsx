import React from 'react';
import '../App.css';
import { User, Visits } from '../interfaces';
import UserProfile from './UserProfile';
import Login from './Login';

interface Props {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setVisits: React.Dispatch<React.SetStateAction<Visits | undefined>>;
}

const Home: React.FC<Props> = ({ user, setUser, setVisits }) => {
  if(user) {
    return (
      <UserProfile user={user} setUser={setUser} />
    );
  }
  else {
    return (
      <Login setUser={setUser} setVisits={setVisits} />
    );
  }
};

export default Home;
