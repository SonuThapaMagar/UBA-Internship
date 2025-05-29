import { expect, it, vi } from 'vitest';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages';
import { UserController } from '../../src/controller/UserController';

const mockUserService = { deleteAddress: vi.fn() } as any;
const controller = new UserController(mockUserService);

it('should call next with error if addressId is missing', async () => {
  const req: any = { params: {} };
  const res: any = {};
  const next = vi.fn();

  await controller.deleteAddress(req, res, next);

  expect(next).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.MISSING_ADDRESS_ID));
});