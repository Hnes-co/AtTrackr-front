
import React, { useState } from 'react';
import defaultProfilePic from '../assets/traveller-edited.png';
import { User } from '../interfaces';
import { editUser } from '../services/index';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Header from './Header';

interface Props {
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
}

const Transition = React.forwardRef(
  function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const UserProfile: React.FC<Props> = ({ user, setUser }) => {

  const [country, setCountry] = useState<string>(user.country);
  const [profilePic, setProfilePic] = useState<string>(user.profilePic);
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState<string>(user.name);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordHash, setPassword] = useState<string>('');
  const [message, setMessage] = useState({ type: '', message: '' });
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const buttonClassnames = [
    "header-button button-addPlace",
    "header-button button-visits",
    "header-button button-profile header-active"
  ];

  function handleProfileEdit() {
    if(disabled) {
      setDisabled(!disabled);
    }
    else {
      setMessage({ type: '', message: '' });
      setDialogOpen(true);
    }
  }

  async function handleUserEdit(event: any) {
    event.preventDefault();
    const username = user.username;
    try {
      const updatedUser = await editUser({ name, country, profilePic, username, passwordHash });
      setUser(updatedUser);
      window.localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
      setMessage({ type: 'success', message: 'User data updated successfully!' });
      setDisabled(!disabled);
    } catch(exception) {
      console.log(exception);
      setMessage({ type: 'error', message: 'User data update failed' });
    }
    setPassword('');
  }

  function resetProfile() {
    setName(user.name);
    setCountry(user.country);
    setProfilePic(user.profilePic);
    setDialogOpen(false);
    setDisabled(true);
  }

  return (
    <div className="home-container" onClick={dropDownOpen ? () => setDropDownOpen(!dropDownOpen) : undefined}>
      <Header
        dropDownOpen={dropDownOpen}
        setDropDownOpen={setDropDownOpen}
        setUser={setUser}
        buttonClassnames={buttonClassnames}
      />
      <div className="profile-content">
        <div className="profile-picture">
          <img src={profilePic === '' ? defaultProfilePic : profilePic} alt="defaultProfilePic.png"></img>
        </div>
        <div className="profile">
          <div className="profile-header">
            <div className="profile-header-title">My Profile</div>
            <div title={disabled ? "Edit profile" : "Save changes"} className="profile-header-button" onClick={handleProfileEdit}>{disabled ? <EditIcon /> : <CheckIcon />}</div>
          </div>
          <div className="profile-info profile-info-name">
            <div className="profile-info-container">
              <div className="title title-name">NAME</div>
              <input className="info-input info-input-name" type="text" maxLength={20} disabled={disabled} value={name} onChange={({ target }) => setName(target.value)}></input>
            </div>
          </div>
          <div className="profile-info profile-info-country">
            <div className="profile-info-container">
              <div className="title title-country">COUNTRY</div>
              <input className="info-input info-input-country" type="text" maxLength={30} disabled={disabled} value={country} onChange={({ target }) => setCountry(target.value)}></input>
            </div>
          </div>
          <div className="profile-info profile-info-username">
            <div className="profile-info-container">
              <div className="title title-username">USERNAME</div>
              <input className="info-input info-input-username" value={user.username} disabled></input>
            </div>
          </div>
          <div className="profile-info profile-info-picturelink">
            <div className="profile-info-container">
              <div className="title title-picturelink" hidden={disabled}>LINK TO PROFILE PICTURE</div>
              <input hidden={disabled} className="info-input" type="text" maxLength={100} value={profilePic} disabled={disabled} onChange={({ target }) => setProfilePic(target.value)}></input>
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
          <div>Confirm profile update with password</div>
        </DialogTitle>
        <form onSubmit={handleUserEdit}>
          <DialogContent>
            <div className="dialog-form">
              <input className="info-input info-input-password" placeholder="Password" value={passwordHash} onChange={({ target }) => setPassword(target.value)} type="password" required></input>
              <label className={"message-" + message.type}>{message.message}</label>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="dialog-actions">
              <Button type="submit">Confirm</Button>
              <Button onClick={resetProfile}>Cancel changes</Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UserProfile;