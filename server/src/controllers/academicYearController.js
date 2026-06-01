import * as academicYearService from '../services/academicYearService.js';
import { success, error } from '../utils/response.js';

export const getAcademicYears = async (req, res) => {
  try {
    const { departmentId } = req.query;
    let years;
    if (departmentId) {
      years = await academicYearService.getAcademicYearsByDepartment(departmentId);
    } else {
      years = await academicYearService.getAllAcademicYears();
    }
    success(res, years, 'Academic years retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve academic years', 500, err.message);
  }
};

export const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await academicYearService.getAcademicYearWithCourses(id);
    if (!year) {
      return error(res, 'Academic year not found', 404);
    }
    success(res, year, 'Academic year retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve academic year', 500, err.message);
  }
};

export const createAcademicYear = async (req, res) => {
  try {
    const { departmentId, yearName } = req.body;
    if (!departmentId || !yearName) {
      return error(res, 'Department ID and year name are required', 400);
    }
    const year = await academicYearService.createAcademicYear({
      departmentId,
      yearName,
    });
    success(res, year, 'Academic year created successfully', 201);
  } catch (err) {
    error(res, 'Failed to create academic year', 500, err.message);
  }
};

export const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { yearName } = req.body;
    const year = await academicYearService.updateAcademicYear(id, { yearName });
    success(res, year, 'Academic year updated successfully');
  } catch (err) {
    error(res, 'Failed to update academic year', 500, err.message);
  }
};

export const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    await academicYearService.deleteAcademicYear(id);
    success(res, null, 'Academic year deleted successfully');
  } catch (err) {
    error(res, 'Failed to delete academic year', 500, err.message);
  }
};
