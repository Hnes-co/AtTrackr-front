import React, { useState } from "react";
import { User, Visit, Visits } from '../interfaces';
import { getVisits, deleteVisit, updateVisit } from '../services/index';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Header from './Header';
import { Map, Marker } from "pigeon-maps";

interface Props {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  visits: Visits | undefined,
  setVisits: React.Dispatch<React.SetStateAction<Visits | undefined>>,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VisitedPlaces: React.FC<Props> = ({ user, setUser, visits, setVisits }) => {

  const visitTemplate = {
    userId: '',
    _id: '',
    name: '',
    dateCreated: '',
    visited: false,
    comments: [{ _id: '', comment: '' },],
    tags: [{ tag: '' },],
    category: '',
    pictureLink: [{ link: '' },],
    coordinates: {
      lat: '',
      lon: '',
    }
  };

  const [detailDialog, setDetailDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit>(visitTemplate);
  const [disabled, setDisabled] = useState(true);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', message: '' });
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [customCategory, setCustomCategory] = useState<string>('');
  const buttonClassnames = [
    "header-button button-addPlace",
    "header-button button-visits header-active",
    "header-button button-profile"
  ];

  async function fetchVisits() {
    if(user) {
      try {
        const visits = await getVisits(user._id);
        window.localStorage.setItem("userVisits", JSON.stringify(visits));
        setVisits(visits);
      } catch(exception) {
        console.log(exception);
      }
    }
  }

  async function handleDeleteVisit(visitId: string) {
    if(visits) {
      try {
        await deleteVisit(visitId);
        fetchVisits();
        setConfirmDialog(false);
      } catch(exception) {
        console.log(exception);
      }
    }
  }

  function sortVisits(sortCriteria: number) {
    if(visits) {
      switch(sortCriteria) {
        case 1:
          setVisits(visits.concat().sort((a, b) => {
            if(a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            }
            if(a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          }));
          break;
        case 2:
          setVisits(visits.concat().sort((a, b) => {
            if(a.visited && !b.visited) {
              return -1;
            }
            if(!a.visited && b.visited) {
              return 1;
            }
            return 0;
          }));
          break;
        case 3:
          setVisits(visits.concat().sort((a, b) => {
            if((a.category && b.category && a.category.toLowerCase() < b.category.toLowerCase()) || (a.category && !b.category)) {
              return -1;
            }
            if((a.category && b.category && a.category.toLowerCase() > b.category.toLowerCase()) || (!a.category && b.category)) {
              return 1;
            }
            return 0;
          }));
          break;
        case 4:
          setVisits(visits.concat().sort((a, b) => {
            if(Number(new Date(a.dateCreated.split('.').reverse().join())) > Number(new Date(b.dateCreated.split('.').reverse().join()))) {
              return -1;
            }
            if(Number(new Date(a.dateCreated.split('.').reverse().join())) < Number(new Date(b.dateCreated.split('.').reverse().join()))) {
              return 1;
            }
            return 0;
          }));
          break;
      }
    }
  }

  function handleVisitClick(visit: Visit, event: any) {
    setSelectedVisit(visit);
    if(!event.target || event.target.tagName !== 'BUTTON') {
      setDetailDialog(true);
    }
  }

  function handleDialogClose() {
    setDetailDialog(false);
    setDisabled(true);
    setSelectedVisit(visitTemplate);
    setMessage({ type: '', message: '' });
    setCategoryDropdown(false);
  }

  function handleDropDown(event: any) {
    if(dropDownOpen) {
      setDropDownOpen(!dropDownOpen);
    }
    if(categoryDropdown && event.target.className !== 'input-dropdown') {
      setCategoryDropdown(!categoryDropdown);
    }
  }

  async function handleVisitEdit() {
    if(disabled) {
      setDisabled(!disabled);
    }
    else {
      try {
        await updateVisit(selectedVisit);
        fetchVisits();
        setMessage({ type: 'success', message: 'Visit updated successfully!' });

      } catch(exception) {
        console.log(exception);
        setMessage({ type: 'error', message: 'Visit update failed' });
      }
      setDisabled(!disabled);
    }
  }

  function handleCustomCategory(event: any) {
    if(event.key === 'Enter') {
      event.preventDefault();
      setSelectedVisit({ ...selectedVisit, category: customCategory });
      setCustomCategory('');
    }
  }

  return (
    <div className="home-container" onClick={(event) => handleDropDown(event)}>
      <Header
        dropDownOpen={dropDownOpen}
        setDropDownOpen={setDropDownOpen}
        setUser={setUser}
        buttonClassnames={buttonClassnames}
      />
      <div className="visitlist-container">
        <div className="map-container">
          <Map
            defaultCenter={[51.52375733610349, -0.13264737754531097]}
            defaultZoom={2.8}
            minZoom={1.5}
          >
            {visits?.map(visit =>
              <Marker
                anchor={[Number(visit.coordinates.lat), Number(visit.coordinates.lon)]}
                width={40}
                color="green"
                onClick={(event) => handleVisitClick(visit, event)}
                key={visit._id}
              />
            )}
          </Map>
        </div>
        <div className="visitlist-header">
          <div className="visitlist-header-title">
            <label>Sort visits</label>
          </div>
          <div className="visitlist-header-content">
            <label onClick={() => sortVisits(1)}>Name<ArrowDropDownIcon /></label>
            <label onClick={() => sortVisits(3)}>Category<ArrowDropDownIcon /></label>
            <label onClick={() => sortVisits(2)}>Visited<ArrowDropDownIcon /></label>
            <label onClick={() => sortVisits(4)}>Date Added<ArrowDropDownIcon /></label>
          </div>
        </div>
        <div className="visitlist-grid">
          {visits?.map(visit =>
            <div className="visitlist-grid-item" onClick={(event) => handleVisitClick(visit, event)}>
              <div className="grid-item grid-item-top">
                <div className="grid-item-title">
                  <label className="grid-item-title-name">{visit.name}</label>
                  <label className="grid-item-title-date">{visit.dateCreated}</label>
                </div>
                <label className="grid-item-category">{visit.category}</label>
              </div>
              <div className="grid-item grid-item-bottom">
                <div className="grid-item-visited">
                  {visit.visited ?
                    <label className="visited-true"><CheckCircle /><span> Visited</span></label>
                    :
                    <label className="visited-false"><CloseIcon /><span> Not visited</span></label>
                  }
                </div>
                <button className="visitlist-deletebutton" onClick={() => setConfirmDialog(true)}>Remove</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={detailDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
      >
        <DialogTitle>
          <div className="visitdialog-title">
            <div>{selectedVisit.name}</div>
            {disabled ?
              <div className="visitdialog-title-button" onClick={handleVisitEdit}><span>Edit</span><EditLocationAltIcon /></div>
              :
              <div className="visitdialog-title-button" onClick={handleVisitEdit}>Save changes</div>
            }
          </div>
          <div className="visitdialog-visited" hidden={!disabled}>{selectedVisit.visited ? 'You have visited this location' : 'You have not visited this location yet'}</div>
          <div className="visitdialog-info visitdialog-info-visitedcheck">
            <div className="visitdialog-info-container visitdialog-info-container-visitedcheck">
              <div className="title title-visitedcheck" hidden={disabled}>Visited</div>
              <label className="checkbox-container">
                <input type="checkbox" checked={selectedVisit.visited} readOnly></input>
                <span className="checkmark" hidden={disabled} onClick={() => setSelectedVisit({ ...selectedVisit, visited: !selectedVisit.visited })}></span>
              </label>
            </div>
          </div>
          <label className={message.type === "success" ? "resultMessage message-success" : "resultMessage message-error"}>{message.message}</label>
        </DialogTitle>
        <DialogContent>
          <div className="visitdialog-content">
            <div className="visitdialog-info visitdialog-info-coords">
              <div className="visitdialog-info-container">
                <div className="title title-coords">Latitude</div>
                <input className="info-input" type="text" maxLength={20} disabled value={selectedVisit.coordinates.lat}></input>
              </div>
              <div className="visitdialog-info-container">
                <div className="title title-coords">Longitude</div>
                <input className="info-input" type="text" maxLength={20} disabled value={selectedVisit.coordinates.lon}></input>
              </div>
            </div>
            <div className="visitdialog-info visitdialog-info-category">
              <div className="visitdialog-info-container">
                <div className="title">Category</div>
                <div className="dropdown">
                  <div className={disabled ? "title title-category" : "title title-category-active"} onClick={!disabled ? () => setCategoryDropdown(!categoryDropdown) : () => null}>
                    {selectedVisit.category !== '' ? selectedVisit.category : 'No category'} <ArrowDropDownIcon />
                  </div>
                  <div className="dropdown-content" hidden={!categoryDropdown}>
                    <label onClick={() => setSelectedVisit({ ...selectedVisit, category: '' })}>None</label>
                    <label onClick={() => setSelectedVisit({ ...selectedVisit, category: 'Nature' })}>Nature</label>
                    <label onClick={() => setSelectedVisit({ ...selectedVisit, category: 'Culture and Heritage' })}>Culture and Heritage</label>
                    <label onClick={() => setSelectedVisit({ ...selectedVisit, category: 'Cities and districts' })}>Cities and districts</label>
                    <input
                      type="text"
                      placeholder="Custom"
                      className="input-dropdown"
                      maxLength={30}
                      onKeyDown={(event) => handleCustomCategory(event)}
                      onChange={({ target }) => setCustomCategory(target.value)}
                      value={customCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="visitdialog-info visitdialog-info-comments">
              <div className="visitdialog-info-container">
                <div className="title title-comments">Comments</div>
                <textarea
                  className="info-input info-input-comments"
                  disabled={disabled}
                  value={selectedVisit.comments?.map(e => e.comment).join()}
                  onChange={({ target }) => setSelectedVisit({ ...selectedVisit, comments: [{ comment: target.value }] })}
                ></textarea>
              </div>
            </div>
            <div className="visitdialog-info visitdialog-info-tags">
              <div className="visitdialog-info-container">
                <div className="title title-tags">Tags</div>
                <input
                  className="info-input info-input-tags"
                  type="text"
                  maxLength={100}
                  disabled={disabled}
                  value={selectedVisit.tags?.map(e => e.tag).join()}
                  onChange={({ target }) => setSelectedVisit({ ...selectedVisit, tags: [{ tag: target.value }] })}
                ></input>
              </div>
            </div>
            <div className="visitdialog-info visitdialog-info-pics">
              <div className="visitdialog-info-container">
                <div className="title title-picturelink">Images</div>
                {selectedVisit.pictureLink && selectedVisit.pictureLink.length > 0 && disabled ?
                  selectedVisit.pictureLink.map(element =>
                    <img key={element.link} src={element.link} alt="visit" />
                  )
                  :
                  <input
                    className="info-input info-input-links"
                    disabled={disabled}
                    maxLength={350}
                    value={selectedVisit.pictureLink?.map(e => e.link).join()}
                    onChange={({ target }) => setSelectedVisit({ ...selectedVisit, pictureLink: [{ link: target.value }] })}
                  >
                  </input>
                }
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm visit deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to remove "{selectedVisit.name}" from your visits?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteVisit(selectedVisit._id)}>Confirm</Button>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VisitedPlaces;
