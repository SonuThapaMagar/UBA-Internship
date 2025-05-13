import { beforeAll, beforeEach, vi } from 'vitest';
import { ObjectId } from 'mongodb';

type User = {
  id: string;
  fname: string;
  lname: string;
};

export class mockUserDB {
  public users: User[] = [
    // Changed from private to public
    { id: '5f8d0d55b54764421b7156c1', fname: 'John', lname: 'Doe' },
    { id: '5f8d0d55b54764421b7156c2', fname: 'Jane', lname: 'Smith' },
  ];

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    console.time('createUser');
    const newUser = { ...user, id: new ObjectId().toString() };
    this.users.push(newUser);
    console.timeEnd('createUser');
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async deleteUser(id: string): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    return this.users.splice(index, 1)[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    Object.assign(user, updates);
    return user;
  }
}

export const mockConsole = () => {
  const logs: string[] = [];
  const errors: string[] = [];

  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation((msg) => logs.push(msg));
    vi.spyOn(console, 'error').mockImplementation((msg) => errors.push(msg));
  });

  beforeEach(() => {
    logs.length = 0;
    errors.length = 0;
  });

  return {
    logs,
    errors,
    getLastLog: () => logs[logs.length - 1],
    getLastError: () => errors[errors.length - 1],
  };
};