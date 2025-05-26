export interface Address {
    id: string;
    street: string;
    city: string;
    country: string;
    user?: User; 
}

export interface User {
    id: string;
    fname: string;
    lname: string;
    addresses?: Address[]; 
}

export interface UserCreate {
    fname: string;
    lname: string;
    email:string;
    password:string;
    role?: string;
}

export interface UserOptions {
    fname?: string;
    lname?: string;
    email?:string;
    password?:string
}

export interface AddressCreate {
    street: string;
    city: string;
    country: string;
}

export interface AddressOptions {
    street?: string;
    city?: string;
    country?: string;
}

export interface UserWithAddressCount extends User {
    address_count: number;
    addresses: Address[];
}