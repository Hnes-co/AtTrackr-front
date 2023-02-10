import axios from 'axios';

const userBaseUrl = '/api/users';
const visitBaseUrl = '/api/visits';

export async function createUser(credentials: { name?: string, username: string, passwordHash: string; }) {
  const response = await axios.post(userBaseUrl, credentials);
  return response.data;
};

export async function getUser(credentials: { name?: string, username: string, passwordHash: string; }) {
  const url = userBaseUrl + "?username=" + credentials.username + "&passwordHash=" + credentials.passwordHash;
  console.log(url);
  const response = await axios.get(url);
  return response.data;
};

export async function editUser(data: { name?: string, country?: string, profilePic?: string, username: string, passwordHash: string; }) {
  const response = await axios.put(userBaseUrl, data);
  return response.data;
};

export async function createVisit(visit:
  {
    userId: string,
    name: string,
    dateCreated: string,
    visited: boolean,
    comments?: { comment: string; }[],
    tags?: { tag: string; }[],
    category?: string,
    pictureLink?: { link: string; }[],
    coordinates: {
      lat: string,
      lon: string,
    };
  }) {
  const response = await axios.post(visitBaseUrl, visit);
  return response.data;
};

export async function updateVisit(visit:
  {
    userId: string,
    _id: string,
    name: string,
    dateCreated: string,
    visited: boolean,
    comments?: { comment: string; }[],
    tags?: { tag: string; }[],
    category?: string,
    pictureLink?: { link: string; }[],
    coordinates: {
      lat: string,
      lon: string,
    };
  }) {
  const url = visitBaseUrl + "/" + visit._id;
  const response = await axios.put(url, visit);
  return response.data;
};

export async function getVisits(userId: string) {
  const url = visitBaseUrl + "?userId=" + userId;
  const response = await axios.get(url);
  return response.data;
};

export async function deleteVisit(visitId: string) {
  const url = visitBaseUrl + "/" + visitId;
  const response = await axios.delete(url);
  return response.data;
};
