import * as resultService from '../services/resultService.js';
import * as studentAnswerService from '../services/studentAnswerService.js';
import { success, error } from '../utils/response.js';

export const getResults = async (req, res) => {
  try {
    const { studentId, examId } = req.query;
    let results;
    if (studentId) {
      results = await resultService.getResultsByStudent(studentId);
    } else if (examId) {
      results = await resultService.getResultsByExam(examId);
    } else {
      results = await resultService.getAllResults();
    }
    success(res, results, 'Results retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve results', 500, err.message);
  }
};

export const getResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await resultService.getResultById(id);
    if (!result) {
      return error(res, 'Result not found', 404);
    }
    success(res, result, 'Result retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve result', 500, err.message);
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.userId;

    if (!examId || !answers || !Array.isArray(answers)) {
      return error(res, 'Exam ID and answers are required', 400);
    }

    // Calculate score
    let correctCount = 0;
    const answerPromises = answers.map(async (ans) => {
      const isCorrect = ans.selectedAnswer === ans.correctAnswer;
      if (isCorrect) correctCount++;
      
      return studentAnswerService.upsertStudentAnswer(
        studentId,
        ans.questionId,
        {
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
        }
      );
    });

    await Promise.all(answerPromises);

    const percentage = (correctCount / answers.length) * 100;
    const result = await resultService.createResult({
      studentId,
      examId,
      totalQuestions: answers.length,
      correctAnswers: correctCount,
      score: correctCount,
      percentage,
    });

    success(res, result, 'Exam submitted successfully', 201);
  } catch (err) {
    error(res, 'Failed to submit exam', 500, err.message);
  }
};

export const getStudentExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.userId;
    const result = await resultService.getStudentExamResult(studentId, examId);
    if (!result) {
      return error(res, 'Result not found', 404);
    }
    success(res, result, 'Result retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve result', 500, err.message);
  }
};
