import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncHandler } from '../../src/middleware/asyncHandler';
import { Request, Response, NextFunction } from 'express';

describe('asyncHandler', () => {
  let req = {} as Request;
  let res = {} as Response;
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  const runMiddleware = async (fn: any) =>
    asyncHandler(fn)(req, res, next);

  it('calls the wrapped function successfully', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    await runMiddleware(mockFn);
    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes sync errors to next', async () => {
    const error = new Error('Sync error');
    const mockFn = vi.fn(() => { throw error; });
    await runMiddleware(mockFn);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('passes async errors to next', async () => {
    const error = new Error('Async error');
    const mockFn = vi.fn().mockRejectedValue(error);
    await runMiddleware(mockFn);
    expect(next).toHaveBeenCalledWith(error);
  });
});
