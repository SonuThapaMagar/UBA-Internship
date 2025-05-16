export type Address = {
    id: string;
    street: string;
    city: string;
    country: string;
};

export type User = {
    id: string,
    fname: string,
    lname: string,
}

export type UserCreate = {
    fname: string;
    lname: string;
}

export type UserOptions = {
    fname?: string;
    lname?: string;
};