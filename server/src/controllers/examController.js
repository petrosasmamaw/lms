import * as examService from '../services/examService.js';
import { success, error } from '../utils/response.js';

export const getExams = async (req, res) => {
  try {
    const { courseId } = req.query;
    let exams;
    if (courseId) {
      exams = await examService.getExamsByCourse(courseId);
    } else {
      exams = await examService.getAllExams();
    }
    success(res, exams, 'Exams retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve exams', 500, err.message);
  }
};

export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await examService.getExamWithQuestions(id);
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    success(res, exam, 'Exam retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve exam', 500, err.message);
  }
};

export const createExam = async (req, res) => {
  try {
    const { courseId, title, description, passingPercentage, duration } = req.body;
    if (!courseId || !title) {
      return error(res, 'Course ID and title are required', 400);
    }
    const exam = await examService.createExam({
      courseId,
      title,
      description,
      passingPercentage: passingPercentage || 40,
      duration: duration || 60,
    });
    success(res, exam, 'Exam created successfully', 201);
  } catch (err) {
    error(res, 'Failed to create exam', 500, err.message);
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, passingPercentage, duration, isActive } = req.body;
    const exam = await examService.updateExam(id, {
      title,
      description,
      passingPercentage,
      duration,
      isActive,
    });
    success(res, exam, 'Exam updated successfully');
  } catch (err) {
    error(res, 'Failed to update exam', 500, err.message);
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await examService.deleteExam(id);
    success(res, null, 'Exam deleted successfully');
  } catch (err) {
    error(res, 'Failed to delete exam', 500, err.message);
  }
};
