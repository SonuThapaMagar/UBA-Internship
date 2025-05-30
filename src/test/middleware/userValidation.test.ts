import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param } from 'express-validator';
import { userValidation, updateUserValidation, validateUserId, loginValidation } from '../../app/middleware/userValidation';
import { vi, describe, it, beforeEach, expect } from 'vitest';

// Mock express-validator and response
const mockValidationResult = vi.fn();

vi.mock('express-validator', () => {
  const mockChain = {
    notEmpty: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
    isString: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    if: vi.fn().mockReturnThis(),
    exists: vi.fn().mockReturnValue(true),
    withMessage: vi.fn().mockReturnThis(),
    isUUID: vi.fn().mockReturnThis()
  };

  return {
    validationResult: () => mockValidationResult(),
    body: vi.fn().mockReturnValue(mockChain),
    param: vi.fn().mockReturnValue(mockChain)
  };
});

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('userValidation', () => {
    it('should call next if all required fields are valid', () => {
      req.body = { fname: 'John', lname: 'Doe', email: 'john@example.com', password: 'pass123', role: 'user' };
      mockValidationResult.mockReturnValue({ isEmpty: () => true });
      userValidation[5](req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if fname is missing', () => {
      req.body = { lname: 'Doe', email: 'john@example.com', password: 'pass123' };
      mockValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'First name is required' }] });
      userValidation[5](req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'First name is required' }] });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updateUserValidation', () => {
    it('should call next if optional fields are valid', () => {
      req.body = { fname: 'Jane' };
      mockValidationResult.mockReturnValue({ isEmpty: () => true });
      updateUserValidation[5](req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next if no fields are provided', () => {
      req.body = {};
      mockValidationResult.mockReturnValue({ isEmpty: () => true });
      updateUserValidation[5](req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if fname is invalid', () => {
      req.body = { fname: 123 };
      mockValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'First name must be a string' }] });
      updateUserValidation[5](req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'First name must be a string' }] });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUserId', () => {
    it('should call next if id is a valid UUID', () => {
      req.params = { id: '550e8400-e29b-41d4-a716-446655440000' };
      mockValidationResult.mockReturnValue({ isEmpty: () => true });
      validateUserId[1](req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if id is invalid', () => {
      req.params = { id: 'invalid' };
      mockValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Valid UUID is required' }] });
      validateUserId[1](req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'Valid UUID is required' }] });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('loginValidation', () => {
    it('should call next if email and password are valid', () => {
      req.body = { email: 'john@example.com', password: 'pass123' };
      mockValidationResult.mockReturnValue({ isEmpty: () => true });
      loginValidation[2](req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if email is invalid', () => {
      req.body = { email: 'invalid-email', password: 'pass123' };
      mockValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Valid email is required' }] });
      loginValidation[2](req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'Valid email is required' }] });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if password is missing', () => {
      req.body = { email: 'john@example.com' };
      mockValidationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Password is required' }] });
      loginValidation[2](req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'Password is required' }] });
      expect(next).not.toHaveBeenCalled();
    });
  });
});