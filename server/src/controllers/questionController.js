import * as questionService from '../services/questionService.js';
import { success, error } from '../utils/response.js';

export const getQuestions = async (req, res) => {
  try {
    const { examId } = req.query;
    let questions;
    if (examId) {
      questions = await questionService.getQuestionsByExam(examId);
    } else {
      questions = await questionService.getAllQuestions();
    }
    success(res, questions, 'Questions retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve questions', 500, err.message);
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestionById(id);
    if (!question) {
      return error(res, 'Question not found', 404);
    }
    success(res, question, 'Question retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve question', 500, err.message);
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation } = req.body;
    if (!examId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return error(res, 'All fields are required', 400);
    }
    const question = await questionService.createQuestion({
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
    });
    success(res, question, 'Question created successfully', 201);
  } catch (err) {
    error(res, 'Failed to create question', 500, err.message);
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation } = req.body;
    const question = await questionService.updateQuestion(id, {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
    });
    success(res, question, 'Question updated successfully');
  } catch (err) {
    error(res, 'Failed to update question', 500, err.message);
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await questionService.deleteQuestion(id);
    success(res, null, 'Question deleted successfully');
  } catch (err) {
    error(res, 'Failed to delete question', 500, err.message);
  }
};
