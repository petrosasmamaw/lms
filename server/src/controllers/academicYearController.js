import * as academicYearService from '../services/academicYearService.js';
import { success, error } from '../utils/response.js';

export const getAcademicYears = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const years = await academicYearService.getAllAcademicYears(departmentId);
    success(res, years, 'Academic years retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve academic years', 500, err.message);
  }
};

export const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params; // id interpreted as numeric year
    const { departmentId } = req.query;
    const year = await academicYearService.getAcademicYearWithCourses(Number(id), departmentId);
    if (!year) return error(res, 'Academic year not found', 404);
    success(res, year, 'Academic year retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve academic year', 500, err.message);
  }
};

export const createAcademicYear = async (req, res) => {
  // Academic years are derived from courses.year; creation is not supported via this endpoint.
  error(res, 'Creating academic years is not supported. Create courses with a year instead.', 400);
};

export const updateAcademicYear = async (req, res) => {
  // Updating academic year management is not supported; manage via course years
  error(res, 'Updating academic years is not supported. Update course.year instead.', 400);
};

export const deleteAcademicYear = async (req, res) => {
  // Deleting academic years is not supported; remove courses or change course.year
  error(res, 'Deleting academic years is not supported.', 400);
};
