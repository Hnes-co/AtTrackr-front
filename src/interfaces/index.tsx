
export interface User {
    _id: string,
    name: string,
    country: string,
    profilePic: string,
    username: string,
    passwordHash: string,
};

export interface Visit {
    userId: string,
    _id: string,
    name: string,
    dateCreated: string,
    visited: boolean,
    comments?: {comment: string}[],
    tags?: {tag: string}[],
    category: string,
    pictureLink?: {link: string}[],
    coordinates: {
        lat: string,
        lon: string,
    }
}

export interface Visits extends Array<Visit>{}