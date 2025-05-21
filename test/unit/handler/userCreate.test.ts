import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { userCreate } from '../../../src/handler/userCreate';
import { UserService } from '../../../src/services/userService';
import { UserCreate } from '../../../src/types/User';

vi.mock('../../../src/services/userService');

describe('userCreate handler', () => {
  let mockCreateUser: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCreateUser = vi.fn();
    (UserService as Mock).mockImplementation(() => ({
      createUser: mockCreateUser,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call createUser and log success message', async () => {
    const input: UserCreate = { fname: 'Jane', lname: 'Smith' };
    mockCreateUser.mockResolvedValue({ id: '1', fname: 'Jane', lname: 'Smith', addresses: [] });
    await userCreate(input);
    expect(mockCreateUser).toHaveBeenCalledWith(input);
  });
});