import React, { useState } from "react";
import { User, Visits } from '../interfaces';
import { createVisit } from '../services/index';
import { Map, Marker } from "pigeon-maps";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Header from './Header';

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  visits: Visits | undefined,
  setVisits: React.Dispatch<React.SetStateAction<Visits | undefined>>;
}

const AddLocation: React.FC<Props> = ({ user, setUser, visits, setVisits }) => {

  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
  const [comments, setComments] = useState([{ comment: '' }]);
  const [visited, setVisited] = useState(false);
  const [message, setMessage] = useState({ type: '', message: '' });
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [linksString, setLinksString] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const buttonClassnames = [
    "header-button button-addPlace header-active",
    "header-button button-visits",
    "header-button button-profile"
  ];

  async function handleAddLocation(event: any) {
    event.preventDefault();
    setMessage({ type: '', message: '' });
    if(user) {
      const userId = user._id;
      const dateCreated = new Date().toLocaleString().split(" ", 1).toString();
      const pictureLink = linksString.split(",").map(e => { return { link: e }; }).filter(e => e.link !== '');
      const tags = tagsString.split(",").map(e => { return { tag: e }; }).filter(e => e.tag !== '');
      try {
        const visit = await createVisit({
          userId,
          name,
          dateCreated,
          visited,
          comments,
          tags,
          category,
          pictureLink,
          coordinates
        });
        setName('');
        setCoordinates({ lat: '', lon: '' });
        setComments([{ comment: '' }]);
        setCategory('');
        setTagsString('');
        setLinksString('');
        if(visited) {
          setVisited(!visited);
        }
        visits ? setVisits(prevState => prevState?.concat([visit])) : setVisits([visit]);
        window.localStorage.setItem("userVisits", JSON.stringify(visits));
        setMessage({ type: 'success', message: 'Visit Saved!' });
      } catch(exception) {
        console.log(exception);
        setMessage({ type: 'error', message: 'Error, visit saving failed.' });
      }
    }
  }

  function handleDropDown(event: any) {
    if(dropDownOpen) {
      setDropDownOpen(!dropDownOpen);
    }
    if(categoryDropdown && event.target.className !== 'input-dropdown') {
      setCategoryDropdown(!categoryDropdown);
    }
  }

  function handleCustomCategory() {
    setCategory(customCategory);
    setCustomCategory('');
    setCategoryDropdown(false);
  }

  return (
    <div className="home-container" onClick={(event) => handleDropDown(event)} >
      <Header
        dropDownOpen={dropDownOpen}
        setDropDownOpen={setDropDownOpen}
        setUser={setUser}
        buttonClassnames={buttonClassnames}
      />
      <div className="addPlace-content">
        <div className="addPlace">
          <div className="profile-header">
            <div className="profile-header-title">Add new place</div>
          </div>
          <form onSubmit={handleAddLocation}>
            <div className="addPlace-info addPlace-info-name">
              <div className="addPlace-info-container">
                <div className="title title-name">Place name</div>
                <input
                  className="info-input info-input-name"
                  type="text"
                  maxLength={70}
                  required
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                >
                </input>
              </div>
            </div>
            <div className="addPlace-info addPlace-info-visitedcheck">
              <div className="addPlace-info-container addPlace-info-container-visitedcheck">
                <div className="title title-visitedcheck">Visited</div>
                <label className="checkbox-container">
                  <input type="checkbox"></input>
                  <span className="checkmark" onClick={() => setVisited(!visited)}></span>
                </label>
              </div>
            </div>
            <div className="addPlace-header">
              <div className="addPlace-header-title">Coordinates:</div>
              <p>(enter coordinates manually or click a location from the map to get location coordinates.)</p>
            </div>
            <div className="addPlace-info addPlace-info-coords">
              <div className="addPlace-info-coords-inputs">
                <div className="addPlace-info-container addPlace-info-container-lat">
                  <div className="title title-lat">Latitude: </div>
                  <input
                    className="info-input info-input-lat"
                    type="number"
                    max={90}
                    min={-90}
                    step={0.000000000000001}
                    required
                    name="lat"
                    onChange={({ target }) => setCoordinates({ ...coordinates, lat: target.value })}
                    value={coordinates.lat}
                  />
                </div>
                <div className="addPlace-info-container addPlace-info-container-lon">
                  <div className="title title-lon">Longitude: </div>
                  <input
                    className="info-input info-input-lon"
                    type="number"
                    max={180}
                    min={-180}
                    step={0.000000000000001}
                    required
                    name="lon"
                    onChange={({ target }) => setCoordinates({ ...coordinates, lon: target.value })}
                    value={coordinates.lon}
                  />
                </div>
              </div>
              <div className="map-container">
                <Map
                  height={350}
                  defaultCenter={[51.52375733610349, -0.13264737754531097]}
                  defaultZoom={2}
                  onClick={({ latLng }) => (setCoordinates({ lat: latLng[0].toString(), lon: latLng[1].toString() }))}
                >
                  <Marker
                    anchor={[Number(coordinates.lat), Number(coordinates.lon)]}
                    width={40}
                    color="green"
                  />
                </Map>
              </div>
            </div>
            <div className="addPlace-info addPlace-info-visitedcheck">
              <div className="addPlace-info-container addPlace-info-container-visitedcheck">
                <div className="dropdown">
                  <div className="title title-category-active" onClick={() => setCategoryDropdown(!categoryDropdown)}>{category !== '' ? category : 'Category'} <ArrowDropDownIcon /></div>
                  <div className="dropdown-content" hidden={!categoryDropdown}>
                    <label onClick={() => setCategory('')}>None</label>
                    <label onClick={() => setCategory('Nature')}>Nature</label>
                    <label onClick={() => setCategory('Culture and Heritage')}>Culture and Heritage</label>
                    <label onClick={() => setCategory('Cities and districts')}>Cities and districts</label>
                    <div className="custom-category">
                      <input
                        type="text"
                        placeholder="Custom"
                        className="input-dropdown"
                        maxLength={30}
                        onKeyDown={(event) => event.key === "Enter" ? handleCustomCategory() : null}
                        onChange={({ target }) => setCustomCategory(target.value)}
                        value={customCategory}
                      />
                      <KeyboardTabIcon onClick={handleCustomCategory} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="addPlace-info addPlace-info-imagelinks">
              <div className="addPlace-info-container">
                <div className="title title-links"><label>Image Links</label> <p>(max 3 image links, separate links with ",")</p></div>
                <input
                  className="info-input info-input-name"
                  type="text"
                  maxLength={350}
                  value={linksString}
                  onChange={({ target }) => setLinksString(target.value)}
                />
              </div>
            </div>
            <div className="addPlace-info addPlace-info-comments">
              <div className="addPlace-info-container">
                <div className="title title-comments">Comments</div>
                <textarea
                  className="info-input info-input-comments"
                  maxLength={300}
                  onChange={({ target }) => setComments([{ comment: target.value }])}
                  value={comments[0].comment}
                >
                </textarea>
              </div>
            </div>
            <div className="addPlace-info addPlace-info-tags">
              <div className="addPlace-info-container">
                <div className="title title-links"><label>Tags</label> <p>(separate tags with ",")</p></div>
                <input
                  className="info-input info-input-name"
                  type="text"
                  maxLength={150}
                  value={tagsString}
                  onChange={({ target }) => setTagsString(target.value)}
                />
              </div>
            </div>
            <div className="addPlace-info">
              <div className="addPlace-submit">
                <button type="submit">Add to my places</button>
                <label className={message.type === "success" ? "resultMessage message-success" : "resultMessage message-error"}>{message.message}</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
