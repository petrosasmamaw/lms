import * as departmentService from '../services/departmentService.js';
import { success, error } from '../utils/response.js';

export async function getDepartments(req, res) {
  try {
    const departments = await departmentService.getAllDepartments();
    success(res, departments, 'Departments retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve departments', 500, err.message);
  }
}

export async function getDepartment(req, res) {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentFull(id);
    if (!department) {
      return error(res, 'Department not found', 404);
    }
    success(res, department, 'Department retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve department', 500, err.message);
  }
}

export async function createDepartment(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return error(res, 'Department name is required', 400);
    }
    const department = await departmentService.createDepartment({
      name,
      description,
    });
    success(res, department, 'Department created successfully', 201);
  } catch (err) {
    error(res, 'Failed to create department', 500, err.message);
  }
}

export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const department = await departmentService.updateDepartment(id, {
      name,
      description,
    });
    success(res, department, 'Department updated successfully');
  } catch (err) {
    error(res, 'Failed to update department', 500, err.message);
  }
}

export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    await departmentService.deleteDepartment(id);
    success(res, null, 'Department deleted successfully');

export async function listDepartments(req, res, next) {
  try {
    const list = await deptService.getAllDepartments()
    return success(res, { departments: list }, 'Departments')
  } catch (err) {
    next(err)
  }
}
