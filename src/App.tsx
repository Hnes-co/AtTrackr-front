
import './App.css';
import Home from './components/Home';
import SignUp from './components/SignUp';
import AddLocation from './components/AddLocation';
import VisitedPlaces from './components/VisitedPlaces';
import {
  Routes, Route, useNavigate, useLocation
} from "react-router-dom";
import { User, Visits } from './interfaces';
import { useState, useEffect } from 'react';

function App() {

  const [user, setUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Visits>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    const userVisitsJSON = window.localStorage.getItem('userVisits');
    if(!loggedUserJSON && !(location.pathname === "/" || location.pathname === "/signUp")) {
      navigate("/");
    }
    else if(!user && loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON));
    }
    else if(!visits && userVisitsJSON) {
      setVisits(JSON.parse(userVisitsJSON));
    }
  }, [user, navigate, location.pathname, visits]);

  return (
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/AddLocation" element={<AddLocation user={user} setUser={setUser} visits={visits} setVisits={setVisits} />} />
      <Route path="/VisitedPlaces" element={<VisitedPlaces user={user} setUser={setUser} visits={visits} setVisits={setVisits} />} />
      <Route path="/" element={<Home user={user} setUser={setUser} setVisits={setVisits} />} />
    </Routes>
  );
}

export default App;
