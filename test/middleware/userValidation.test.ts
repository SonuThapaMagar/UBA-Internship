import { describe, it, expect, vi } from 'vitest';
import { userValidation, validateUserId } from '../../src/middleware/userValidation';
import { Request, Response, NextFunction } from 'express';

const createRes = () => {
  const res = {} as Partial<Response>;
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn();
  return res as Response;
};

describe('userValidation middleware', () => {
  const next = vi.fn();

  it('should return 400 if fname or lname is missing', () => {
    const req = { body: { fname: '', lname: '' } } as Request;
    const res = createRes();

    userValidation(new Error('test'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Firstname and lastname are required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if fname and lname are present but an error is thrown', () => {
    const req = { body: { fname: 'John', lname: 'Doe' } } as Request;
    const res = createRes();

    userValidation(new Error('Something went wrong'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    expect(next).toHaveBeenCalled();
  });
});

describe('validateUserId middleware', () => {
  const next = vi.fn();

  it('should return 400 if user ID is missing', () => {
    const req = { params: {} } as Request;
    const res = createRes();

    validateUserId(new Error('Missing ID'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user ID is present', () => {
    const req = { params: { id: '123' } } as unknown as Request;
    const res = createRes();

    validateUserId(new Error('Something went wrong'), req, res, next);

    expect(next).toHaveBeenCalled();
    // Optional: check error handling after next
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });
});
