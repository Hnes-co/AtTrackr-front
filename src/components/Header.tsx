import React, {useState} from "react";
import { Link, useHistory } from 'react-router-dom';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MapIcon from '@mui/icons-material/Map';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import traveller from '../assets/traveller.png';

interface Props {
    dropDownOpen: boolean
    setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleLogout(): void
    buttonClassnames: string[]
}

const Header: React.FC<Props> = ({dropDownOpen, setDropDownOpen, handleLogout, buttonClassnames}) => {

    const [headerClassName, setHeaderClassName] = useState("home-header");
 
    let history = useHistory();
    function navigate(route: string) {
        history.push(route);
    } 

    document.addEventListener('scroll', () => {
        if(window.scrollY > 70 && headerClassName === "home-header") {
            setHeaderClassName("home-header home-header-hide");
        }
        if(window.scrollY < 70) {
            setHeaderClassName("home-header");
        }
    });

    return (
        <div className={headerClassName}>
            <div className="header-nav header-nav-dropdown">
                <div className="dropdown dropdown-nav" onClick={() => setDropDownOpen(!dropDownOpen)}>
                    <MenuIcon />
                    <div className="dropdown-aligner" hidden={!dropDownOpen}>
                    <div className="dropdown-content dropdown-content-nav"> 
                        <label onClick={() => navigate("/")}><AccountCircleIcon/><span>My Profile</span></label>
                        <label onClick={() => navigate("/AddLocation")}><AddLocationAltIcon/><span>Add new Place</span></label>
                        <label onClick={() => navigate("/VisitedPlaces")}><MapIcon/><span>My Places</span></label>
                        <label onClick={handleLogout}><LogoutIcon/><span>Log out</span></label>
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
                <Link className={buttonClassnames[0]} to="/AddLocation"><AddLocationAltIcon/>Add New Place</Link>
                <Link className={buttonClassnames[1]} to="/VisitedPlaces"><MapIcon/>My Places</Link>
                <Link className={buttonClassnames[2]} to="/"><AccountCircleIcon/>My Profile</Link>
                <div className="header-button button-logout" onClick={handleLogout}>
                    <LogoutIcon/>
                    Log out
                </div>
            </div>
        </div>
    )
}

export default Header;