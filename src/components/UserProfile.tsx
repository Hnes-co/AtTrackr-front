
import React, {useEffect, useState} from "react"
import defaultProfilePic from '../assets/traveller-edited.png';
import {User} from '../interfaces';
import { editUser, getUser } from '../services/index';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from '@mui/material/Button';
import Header from './Header';

interface Props {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfile: React.FC<Props> = ({user, setUser}) => {

  const [country, setCountry] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordHash, setPassword] = useState<string>('');
  const [message, setMessage] = useState({type: '', message: ''});
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const buttonClassnames = [
    "header-button button-addPlace",
    "header-button button-visits",
    "header-button button-profile header-active"  
  ];

  useEffect(() => { 
    updateUserdata();
  }, [])// eslint-disable-line react-hooks/exhaustive-deps

  function updateUserdata() {
    if(user) {
      setName(user.name)
      setCountry(user.country);
      setProfilePic(user.profilePic);
    }
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem('loggedUser');
    window.localStorage.removeItem('userVisits');
  }

  function handleProfileEdit() {
    if(disabled) {
      setDisabled(!disabled);
    }
    else {
      setMessage({type: '', message: ''});
      setDialogOpen(true);
    }
  }
  async function handleEditUser(event: any) {
    event.preventDefault();
    if(user) {
      const username = user.username;
      try {
        await editUser({name, country, profilePic, username, passwordHash});
        const user = await getUser({username, passwordHash});
        setUser(user);
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        setMessage({type: 'success', message: 'User data updated successfully!'})
        setDisabled(!disabled);
      } catch(exception) {
        console.log(exception);
        setMessage({type: 'error', message: 'User data update failed'});
      }
      setPassword('');
    }
  }

  function cancelUserEdit() {
    updateUserdata();
    setDialogOpen(false);
    setDisabled(!disabled);
  }

  function handleDropDown() {
    if(dropDownOpen) {
      setDropDownOpen(!dropDownOpen);
    }
  }

  return (
      <div className="home-container" onClick={handleDropDown}>
        <Header 
          dropDownOpen={dropDownOpen}
          setDropDownOpen={setDropDownOpen}
          handleLogout={handleLogout}
          buttonClassnames={buttonClassnames}
        />
        <div className="profile-content">
          <div className="profile-picture">
            <img src={profilePic === '' ? defaultProfilePic : profilePic} alt="defaultProfilePic.png"></img>
          </div>
          <div className="profile">
            <div className="profile-header">
              <div className="profile-header-title">User Profile</div>
              <div className="profile-header-button" onClick={handleProfileEdit} hidden={!disabled}>Edit profile</div>
              <div className="profile-header-button" onClick={handleProfileEdit} hidden={disabled}>Save changes</div>
            </div>
            <div className="profile-info profile-info-name">
              <div className="profile-info-container">
                <div className="title title-name">NAME</div>
                <input className="info-input info-input-name" type="text" maxLength={20} disabled={disabled} value={name} onChange={({target}) => setName(target.value)}></input>
              </div>
            </div>
            <div className="profile-info profile-info-country">
              <div className="profile-info-container">
                <div className="title title-country">COUNTRY</div>
                <input className="info-input info-input-country" type="text" maxLength={30} disabled={disabled} value={country} onChange={({target}) => setCountry(target.value)}></input>
              </div>
            </div>
            <div className="profile-info profile-info-username">
              <div className="profile-info-container">
                <div className="title title-username">USERNAME</div>
                <input className="info-input info-input-username" value={user ? user.username : ''} disabled></input>
              </div>
            </div>
            <div className="profile-info profile-info-picturelink">
              <div className="profile-info-container">
                <div className="title title-picturelink" hidden={disabled}>LINK TO PROFILE PICTURE</div>
                <input hidden={disabled} className="info-input" type="text" maxLength={100} value={profilePic} disabled={disabled} onChange={({target}) => setProfilePic(target.value)}></input>
              </div>
            </div>
          </div>
          <div className="content-aligner"></div>
        </div>
        <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          <div>
            <div>Confirm profile update with password</div>
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditUser}>
            <div className="dialog-form">
              <input className="info-input info-input-password" placeholder="Password" value={passwordHash} onChange={({target}) => setPassword(target.value)} type="password" required></input>
              <label className={message.type === "success" ? "resultMessage message-success" : "resultMessage message-error"}>{message.message}</label>
              <button className="login-form-submit" type="submit">Confirm</button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="dialog-actions">
            <Button onClick={cancelUserEdit}>Cancel Changes</Button>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </div>
        </DialogActions>
      </Dialog> 
    </div>
  )
}

export default UserProfile;