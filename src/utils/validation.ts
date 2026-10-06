import { Question, QuestionStatus } from '../types/questionnaire';

export interface QuestionValidationResult {
  status: QuestionStatus;
  errorMessage?: string;
}

export function validateQuestionAnswer(question: Question, value: any): QuestionValidationResult {
  // If not required and empty
  const isEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);

  if (!question.required && isEmpty) {
    return { status: 'answered' };
  }

  // If required and empty
  if (question.required && isEmpty) {
    return {
      status: 'error',
      errorMessage: 'Esta pregunta es obligatoria. Ingrese o seleccione una respuesta para continuar.',
    };
  }

  // Type specific validations
  switch (question.type) {
    case 'number': {
      const num = Number(value);
      if (isNaN(num)) {
        return { status: 'error', errorMessage: 'Debe ingresar un valor numérico válido.' };
      }
      if (!Number.isInteger(num)) {
        return { status: 'error', errorMessage: 'Debe ingresar un número entero.' };
      }
      if (question.validation?.min !== undefined && num < question.validation.min) {
        return {
          status: 'error',
          errorMessage: `El valor no puede ser menor a ${question.validation.min} años.`,
        };
      }
      if (question.validation?.max !== undefined && num > question.validation.max) {
        return {
          status: 'error',
          errorMessage: `El valor no puede ser mayor a ${question.validation.max} años.`,
        };
      }
      return { status: 'answered' };
    }

    case 'amount_conditional': {
      // Expecting { option: 'Sí' | 'No' | 'No me consta', amount?: number, unknownAmount?: boolean }
      if (!value || !value.option) {
        return { status: 'error', errorMessage: 'Seleccione una de las opciones disponibles.' };
      }
      if (value.option === 'Sí') {
        if (value.unknownAmount) {
          return { status: 'answered' };
        }
        if (value.amount === undefined || value.amount === '' || value.amount === null) {
          return {
            status: 'error',
            errorMessage: 'Indique el monto aproximado al mes o marque la casilla "No sé".',
          };
        }
        const amt = Number(value.amount);
        if (isNaN(amt) || amt < 0) {
          return { status: 'error', errorMessage: 'El monto debe ser un número mayor o igual a 0.' };
        }
        if (amt > 5000000) {
          return {
            status: 'error',
            errorMessage: 'El monto mensual no puede exceder $5,000,000 pesos.',
          };
        }
      }
      return { status: 'answered' };
    }

    case 'matrix': {
      // Expecting an object mapping item IDs to selected column value
      const matrixVal = typeof value === 'object' && value !== null ? value : {};
      const items = question.matrixItems || [];
      const missingCount = items.filter((item) => !matrixVal[item.id]).length;

      if (missingCount > 0) {
        return {
          status: 'error',
          errorMessage: `Faltan responder ${missingCount} de los ${items.length} aspectos listados.`,
        };
      }
      return { status: 'answered' };
    }

    case 'ranked_select': {
      // Expecting an array of selected option values in order of priority: [first, second, third]
      const rankedArray = Array.isArray(value) ? value : [];
      const targetCount = question.validation?.exactRankCount || 3;
      if (rankedArray.length < targetCount) {
        return {
          status: 'error',
          errorMessage: `Debe seleccionar y ordenar exactamente ${targetCount} problemas (ha elegido ${rankedArray.length}).`,
        };
      }
      return { status: 'answered' };
    }

    case 'multiple': {
      if (!Array.isArray(value) || value.length === 0) {
        return { status: 'error', errorMessage: 'Seleccione al menos una opción.' };
      }
      const exclusiveOption = question.options?.find((option) => option.exclusive && value.includes(option.value));
      if (exclusiveOption && value.length > 1) {
        return { status: 'error', errorMessage: 'La opción seleccionada no puede combinarse con otras.' };
      }
      if (!exclusiveOption && question.validation?.exactSelectionCount !== undefined && value.length !== question.validation.exactSelectionCount) {
        return {
          status: 'error',
          errorMessage: `Seleccione exactamente ${question.validation.exactSelectionCount} opciones.`,
        };
      }
      if (!exclusiveOption && question.validation?.maxSelections !== undefined && value.length > question.validation.maxSelections) {
        return {
          status: 'error',
          errorMessage: `Seleccione como máximo ${question.validation.maxSelections} opciones.`,
        };
      }
      return { status: 'answered' };
    }

    case 'long_text':
    case 'short_text': {
      const strVal = String(value || '');
      if (question.validation?.maxLength && strVal.length > question.validation.maxLength) {
        return {
          status: 'error',
          errorMessage: `El texto no debe exceder los ${question.validation.maxLength} caracteres (actual: ${strVal.length}).`,
        };
      }
      return { status: 'answered' };
    }

    case 'single':
    default: {
      if (value === undefined || value === null || value === '') {
        return { status: 'error', errorMessage: 'Seleccione una opción.' };
      }
      return { status: 'answered' };
    }
  }
}
