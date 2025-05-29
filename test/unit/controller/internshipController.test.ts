import { describe, it, vi, beforeEach, expect } from 'vitest';
import { InternshipController } from '../../../src/controller/InternshipController';
import { InternshipService } from '../../../src/services/internshipService';
import { Request, Response, NextFunction } from 'express';
import { Internship } from '../../../src/entity/Internship';
import { InternshipCreate } from '../../../src/types/Internship';

type MockInternshipService = {
  createInternship: ReturnType<typeof vi.fn>;
  getUserInternships: ReturnType<typeof vi.fn>;
};


describe('InternshipController', () => {
  let controller: InternshipController;
  let mockInternshipService: MockInternshipService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const mockInternship: Internship = {
    id: 1,
    userId: '1',
    mentorName: 'John Mentor',
    joinedDate: new Date('2024-01-01'),
    completionDate: null,
    isCertified: false,
    user: {
      id: '1',
      fname: 'John',
      lname: 'Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: 'user',
      internships: []
    }
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock service
    mockInternshipService = {
      createInternship: vi.fn(),
      getUserInternships: vi.fn()
    };

    // Create controller instance
    controller = new InternshipController(mockInternshipService as unknown as InternshipService);

    // Setup request mock
    req = {
      body: {},
      params: {},
      query: {}
    };

    // Setup response mock
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn()
    };

    // Setup next function mock
    next = vi.fn();
  });

  describe('createInternship', () => {
    it('should create a new internship successfully', async () => {
      const internshipData: InternshipCreate = {
        userId: '1',
        mentorName: 'John Mentor',
        joinedDate: new Date('2024-01-01'),
        completionDate: null,
        isCertified: false
      };

      req.params = { id: '1' };
      req.body = {
        mentorName: 'John Mentor',
        joinedDate: new Date('2024-01-01'),
        completionDate: null,
        isCertified: false
      };

      mockInternshipService.createInternship.mockResolvedValue(mockInternship);

      await controller.createInternship(req as Request, res as Response, next);

      expect(mockInternshipService.createInternship).toHaveBeenCalledWith(internshipData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockInternship);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', async () => {
      req.params = { id: '1' };
      req.body = { mentorName: 'John Mentor' }; // Missing joinedDate

      await controller.createInternship(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new Error('Mentor name and joined date are required'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockInternshipService.createInternship).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Failed to create internship');
      req.params = { id: '1' };
      req.body = {
        mentorName: 'John Mentor',
        joinedDate: new Date('2024-01-01')
      };
      mockInternshipService.createInternship.mockRejectedValue(error);

      await controller.createInternship(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('getInternships', () => {
    it('should return user internships successfully', async () => {
      const userId = '1';
      const mockInternships = [mockInternship];
      req.params = { id: userId };
      mockInternshipService.getUserInternships.mockResolvedValue(mockInternships);

      await controller.getInternships(req as Request, res as Response, next);

      expect(mockInternshipService.getUserInternships).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInternships);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle non-existent user', async () => {
      const error = new Error('User not found');
      req.params = { id: '999' };
      mockInternshipService.getUserInternships.mockRejectedValue(error);

      await controller.getInternships(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle empty internships list', async () => {
      req.params = { id: '1' };
      mockInternshipService.getUserInternships.mockResolvedValue([]);

      await controller.getInternships(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
