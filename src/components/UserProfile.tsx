
import React, { useState, useRef } from 'react';
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

  const nameRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
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
    const name = nameRef.current?.value;
    const country = countryRef.current?.value;
    const profilePic = profilePicRef.current?.value;
    if(passwordRef.current) {
      try {
        const updatedUser = await editUser({
          name: name === "" || null ? user.name : name,
          country: country === "" || null ? user.country : country,
          profilePic: profilePic === "" || null ? user.profilePic : profilePic,
          username,
          passwordHash: passwordRef.current.value
        });
        setUser(updatedUser);
        window.localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        setDialogOpen(false);
        setDisabled(!disabled);
        passwordRef.current.value = "";
      } catch(exception) {
        console.log(exception);
        setMessage({ type: 'error', message: 'User data update failed' });
      }
    }
  }

  function resetProfile() {
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
          <img src={user.profilePic === "" ? defaultProfilePic : user.profilePic} alt="defaultProfilePic.png"></img>
        </div>
        <div className="profile">
          <div className="profile-header">
            <div className="profile-header-title">My Profile</div>
            <button title={disabled ? "Edit profile" : "Save changes"} className="profile-header-button" onClick={handleProfileEdit}>{disabled ? <EditIcon /> : <CheckIcon />}</button>
          </div>
          <div className="profile-info profile-info-name">
            <div className="profile-info-container">
              <div className="title title-name">{user.name}</div>
              <input ref={nameRef} className="info-input info-input-name" type="text" maxLength={20} hidden={disabled} placeholder="New name" />
            </div>
          </div>
          <div className="profile-info profile-info-country">
            <div className="profile-info-container">
              <div className="title title-country">{user.country}</div>
              <input ref={countryRef} className="info-input info-input-country" type="text" maxLength={30} hidden={disabled} placeholder="New country" />
            </div>
          </div>
          <div className="profile-info profile-info-picturelink">
            <div className="profile-info-container">
              <div className="title title-picturelink" hidden={disabled}>Link to profile picture</div>
              <input ref={profilePicRef} hidden={disabled} className="info-input" type="text" maxLength={100} />
            </div>
          </div>
          <div className="profile-info profile-info-username">
            <div className="profile-info-container">
              <div className="title title-username">{user.username}</div>
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
              <input ref={passwordRef} className="info-input info-input-password" placeholder="Password" type="password" required />
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