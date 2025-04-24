export interface User {
    id: string,
    fname: string,
    lname: string,
}

export interface UserCreate {
    fname: string;
    lname: string;
}
