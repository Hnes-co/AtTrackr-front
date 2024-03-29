import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../interfaces';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MapIcon from '@mui/icons-material/Map';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import traveller from '../assets/traveller.png';

interface Props {
  dropDownOpen: boolean;
  setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  buttonClassnames: string[];
}

const Header: React.FC<Props> = ({ dropDownOpen, setDropDownOpen, setUser, buttonClassnames }) => {

  function handleLogout() {
    window.localStorage.removeItem('loggedUser');
    window.localStorage.removeItem('userVisits');
    setUser(null);
  }

  return (
    <div className="home-header">
      <div className="header-nav header-nav-dropdown">
        <div className="dropdown dropdown-nav" onClick={() => setDropDownOpen(!dropDownOpen)}>
          <MenuIcon />
          <div className="dropdown-aligner" hidden={!dropDownOpen}>
            <div className="dropdown-content dropdown-content-nav">
              <Link to="/"><AccountCircleIcon /><span>My Profile</span></Link>
              <Link to="/AddLocation"><AddLocationAltIcon /><span>Add new Place</span></Link>
              <Link to="/VisitedPlaces"><MapIcon /><span>My Places</span></Link>
              <a href="/" onClick={handleLogout}><LogoutIcon /><span>Log out</span></a>
            </div>
          </div>
        </div>
      </div>
      <div className="header-nav">
        <div className="login-image">
          <img src={traveller} alt="traveller.png"></img>
        </div>
        <div className="header-title">AtTrackr</div>
      </div>
      <div className="header-nav">
        <Link className={buttonClassnames[0]} to="/AddLocation"><AddLocationAltIcon />Add New Place</Link>
        <Link className={buttonClassnames[1]} to="/VisitedPlaces"><MapIcon />My Places</Link>
        <Link className={buttonClassnames[2]} to="/"><AccountCircleIcon />My Profile</Link>
        <a href="/" className="header-button button-logout" onClick={handleLogout}>
          <LogoutIcon />
          Log out
        </a>
      </div>
    </div>
  );
};

export default Header;
