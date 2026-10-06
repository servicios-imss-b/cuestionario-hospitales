import { Question, QuestionStatus } from '../types/questionnaire';
import { validateQuestionAnswer } from './validation';

export interface ProgressSummary {
  total: number;
  answered: number;
  pending: number;
  errorCount: number;
  percentage: number;
  canSubmit: boolean;
  questionStatuses: Record<string, { status: QuestionStatus; errorMessage?: string }>;
}

export function calculateSurveyProgress(
  questions: Question[],
  answers: Record<string, any>
): ProgressSummary {
  let total = questions.length;
  let answered = 0;
  let pending = 0;
  let errorCount = 0;

  const questionStatuses: Record<string, { status: QuestionStatus; errorMessage?: string }> = {};

  for (const q of questions) {
    const val = answers[q.id];
    const isTouched = val !== undefined && val !== null && val !== '';

    if (!isTouched) {
      if (q.required) {
        pending++;
        questionStatuses[q.id] = { status: 'pending' };
      } else {
        // Optional question not yet filled is treated as answered or optional
        answered++;
        questionStatuses[q.id] = { status: 'answered' };
      }
    } else {
      const result = validateQuestionAnswer(q, val);
      if (
        q.type === 'multiple' &&
        q.validation?.requiresConfirmation &&
        result.status === 'answered' &&
        answers[`${q.id}__confirmed`] !== true
      ) {
        result.status = 'error';
        result.errorMessage = 'Confirme la selección para continuar.';
      }
      questionStatuses[q.id] = result;
      if (result.status === 'answered') {
        answered++;
      } else {
        errorCount++;
      }
    }
  }

  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  const canSubmit = pending === 0 && errorCount === 0;

  return {
    total,
    answered,
    pending,
    errorCount,
    percentage,
    canSubmit,
    questionStatuses,
  };
}
