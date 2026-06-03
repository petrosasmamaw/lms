import * as examService from '../services/examService.js';
import * as questionService from '../services/questionService.js';
import { db } from '../db/index.js';
import { studentExamAttempts } from '../db/schema.js';
import { success, error } from '../utils/response.js';

export const getExams = async (req, res) => {
  try {
    const { courseId } = req.query;
    const exams = courseId
      ? await examService.getExamsByCourse(courseId)
      : await examService.getAllExams();
    success(res, { exams }, 'Exams retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve exams', 500, err.message);
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    if (!exam) return error(res, 'Exam not found', 404);
    success(res, { exam }, 'Exam retrieved successfully');
  } catch (err) {
    error(res, 'Failed to retrieve exam', 500, err.message);
  }
};

export const createExam = async (req, res) => {
  try {
    const { courseId, title } = req.body;
    if (!courseId || !title) return error(res, 'Course ID and title are required', 400);
    const exam = await examService.createExam({ courseId, title });
    success(res, { exam }, 'Exam created successfully', 201);
  } catch (err) {
    error(res, 'Failed to create exam', 500, err.message);
  }
};

export const getExamQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsWithChoicesByExam(req.params.examId);
    success(res, { questions }, 'Questions retrieved');
  } catch (err) {
    error(res, 'Failed to retrieve questions', 500, err.message);
  }
};

export const addExamQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionText, text, choices: rawChoices, correct } = req.body;

    const qText = questionText || text;
    if (!qText) return error(res, 'Question text is required', 400);

    let choiceList = rawChoices;
    if (Array.isArray(rawChoices) && typeof rawChoices[0] === 'string') {
      choiceList = rawChoices.map((choiceText, idx) => ({
        choiceText,
        isCorrect: idx === Number(correct),
      }));
    }

    if (!Array.isArray(choiceList) || choiceList.length < 2) {
      return error(res, 'At least two choices are required', 400);
    }

    const question = await questionService.createQuestionWithChoices({
      examId,
      questionText: qText,
      choices: choiceList,
    });

    success(res, { question }, 'Question created', 201);
  } catch (err) {
    error(res, 'Failed to create question', 500, err.message);
  }
};

export const getExamAttempt = async (req, res) => {
  try {
    const { examId } = req.params;
    const { getStudentExamResult } = await import('../services/resultService.js');
    const attempt = await getStudentExamResult(req.userId, Number(examId));
    if (!attempt) {
      return success(res, { attempt: null }, 'No attempt yet');
    }
    success(res, { attempt }, 'Attempt retrieved');
  } catch (err) {
    error(res, 'Failed to retrieve attempt', 500, err.message);
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    if (!answers || (typeof answers !== 'object' && !Array.isArray(answers))) {
      return error(res, 'Answers are required', 400);
    }

    const { getStudentExamResult } = await import('../services/resultService.js');
    const existing = await getStudentExamResult(req.userId, Number(examId));
    if (existing) {
      return error(res, 'Exam already submitted', 409);
    }

    const { score, total, correct } = await questionService.gradeExamSubmission(examId, answers);

    const [attempt] = await db.insert(studentExamAttempts).values({
      studentId: req.userId,
      examId: Number(examId),
      score: String(score),
    }).returning();

    success(res, { attempt, score, total, correct }, 'Exam submitted');
  } catch (err) {
    error(res, 'Failed to submit exam', 500, err.message);
  }
};

export const updateExam = async (req, res) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body);
    success(res, { exam }, 'Exam updated successfully');
  } catch (err) {
    error(res, 'Failed to update exam', 500, err.message);
  }
};

export const deleteExam = async (req, res) => {
  try {
    await examService.deleteExam(req.params.id);
    success(res, null, 'Exam deleted successfully');
  } catch (err) {
    error(res, 'Failed to delete exam', 500, err.message);
  }
};
