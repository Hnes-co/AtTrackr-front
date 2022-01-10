import React from 'react';
import './App.css';
import Home from './components/Home';
import SignUp from './components/SignUp';
import AddLocation from './components/AddLocation';
import VisitedPlaces from './components/VisitedPlaces';
import {
  BrowserRouter as Router,
  Switch, Route
} from "react-router-dom";
import {User, Visits} from './interfaces';
import { useState } from 'react';


function App() {

  const [user, setUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Visits>();

  return (
    <Router>
      <Switch>
        <Route path="/signUp">
          <SignUp></SignUp>
        </Route>
        <Route path="/AddLocation">
          <AddLocation user={user} setUser={setUser}></AddLocation>
        </Route>
        <Route path="/VisitedPlaces">
          <VisitedPlaces user={user} setUser={setUser} visits={visits} setVisits={setVisits}></VisitedPlaces>
        </Route>
        <Route path="/">
          <Home user={user} setUser={setUser}></Home>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
