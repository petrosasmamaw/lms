import * as courseService from '../services/courseService.js';
import { courseSchema } from '../validators/courseValidator.js';
import { success, error } from '../utils/response.js';

export async function createCourse(req, res, next) {
  try {
    const payload = courseSchema.parse(req.body);
    const course = await courseService.createCourse(payload);
    return success(res, { course }, 'Course created', 201);
  } catch (err) {
    next(err);
  }
}

export async function getCourse(req, res, next) {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return error(res, 'Course not found', 404);
    return success(res, { course }, 'Course');
  } catch (err) {
    next(err);
  }
}

export async function listCourses(req, res, next) {
  try {
    const { departmentId, year } = req.query;
    let list;
    if (departmentId) {
      list = await courseService.getCoursesByDepartmentAndYear(departmentId, year);
    } else {
      list = await courseService.getAllCourses();
    }
    return success(res, { courses: list }, 'Courses');
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const payload = courseSchema.parse(req.body);
    const course = await courseService.updateCourse(req.params.id, payload);
    return success(res, { course }, 'Course updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    await courseService.deleteCourse(req.params.id);
    return success(res, {}, 'Course deleted');
  } catch (err) {
    next(err);
  }
}
