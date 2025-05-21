import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { userValidation, addressValidation, validateUserId } from '../../src/middleware/userValidation';

describe('User Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe('userValidation', () => {
    it('should call next if fname and lname are provided', () => {
      req.body = { fname: 'John', lname: 'Doe' };
      userValidation(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if fname or lname is missing', () => {
      req.body = { fname: 'John' };
      userValidation(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if fname or lname is not a string', () => {
      req.body = { fname: 123, lname: 'Doe' };
      userValidation(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if exception is thrown', () => {
      const error = new Error('Test error');
      const brokenReq = new Proxy({}, { get: () => { throw error; } });
      userValidation(brokenReq as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addressValidation', () => {
    it('should call next if all fields are present', () => {
      req.body = { street: 'A', city: 'B', country: 'C' };
      addressValidation(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if any field is missing', () => {
      req.body = { street: 'A', city: 'B' };
      addressValidation(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Street, city, and country are required' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUserId', () => {
    it('should return 400 if id is missing', () => {
      req.params = {};
      validateUserId(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User ID is required'
      });
    });

    it('should call next if id is valid', () => {
      req.params = { id: '1' };
      validateUserId(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });
});