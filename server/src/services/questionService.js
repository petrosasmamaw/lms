import { db } from '../db/index.js';
import { questions, choices } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getQuestionsWithChoicesByExam = async (examId) => {
  const qs = await db.query.questions.findMany({
    where: eq(questions.examId, Number(examId)),
    with: { choices: true },
  });
  return qs;
};

export const createQuestionWithChoices = async ({ examId, questionText, choices: choiceList }) => {
  const [question] = await db.insert(questions).values({
    examId: Number(examId),
    questionText,
  }).returning();

  const createdChoices = [];
  for (const c of choiceList) {
    const [row] = await db.insert(choices).values({
      questionId: question.id,
      choiceText: c.choiceText,
      isCorrect: Boolean(c.isCorrect),
    }).returning();
    createdChoices.push(row);
  }

  return { ...question, choices: createdChoices };
};

function normalizeAnswers(answers) {
  if (Array.isArray(answers)) {
    const map = {};
    for (const item of answers) {
      if (item?.questionId != null && item?.choiceId != null) {
        map[String(item.questionId)] = item.choiceId;
      }
    }
    return map;
  }
  return answers || {};
}

export const gradeExamSubmission = async (examId, answers) => {
  const qs = await getQuestionsWithChoicesByExam(examId);
  if (!qs.length) return { score: 0, total: 0, correct: 0 };

  const answerMap = normalizeAnswers(answers);
  let correct = 0;
  for (const q of qs) {
    const submittedChoiceId = answerMap[String(q.id)] ?? answerMap[q.id];
    const match = q.choices?.find((c) => c.id === Number(submittedChoiceId) && c.isCorrect);
    if (match) correct += 1;
  }

  const total = qs.length;
  const score = total ? Number(((correct / total) * 100).toFixed(2)) : 0;
  return { score, total, correct };
};
