export type QuestionType =
  | 'single'
  | 'multiple'
  | 'boolean'
  | 'number'
  | 'short_text'
  | 'long_text'
  | 'matrix'
  | 'ranked_select'
  | 'amount_conditional';

export type UserRole = 'director' | 'coordinador';

export interface Entity {
  id: string;
  name: string;
}

export interface Clues {
  clues: string;
  entityId: string;
  name: string;
  tipo: string; // e.g. 'Hospital General', 'Hospital Comunitario', 'Hospital Regional de Alta Especialidad'
  region?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  exclusive?: boolean; // For options like "Ninguno", "No me consta" in multi-select
  helpText?: string;
}

export interface MatrixItem {
  id: string;
  label: string;
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  exactRankCount?: number;
  maxSelections?: number;
  exactSelectionCount?: number;
  requiresConfirmation?: boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  sectionTitle: string;
  sectionDescription?: string;
  text: string;
  coordinatorText?: string; // Text variant when answered by regional coordinators
  type: QuestionType;
  required: boolean;
  help?: string;
  options?: QuestionOption[];
  roleOptions?: Partial<Record<UserRole, QuestionOption[]>>;
  roleDisplayIds?: Partial<Record<UserRole, string>>;
  roleSectionIds?: Partial<Record<UserRole, string>>;
  matrixColumns?: QuestionOption[];
  matrixItems?: MatrixItem[];
  roleMatrixItems?: Partial<Record<UserRole, MatrixItem[]>>;
  roleSectionTitles?: Partial<Record<UserRole, string>>;
  roleValidation?: Partial<Record<UserRole, QuestionValidation>>;
  validation?: QuestionValidation;
  appliesToRoles?: UserRole[]; // If not set, applies to all
  condition?: (answers: Record<string, any>) => boolean;
}

export type QuestionStatus = 'pending' | 'answered' | 'error';

export interface AnswerItem {
  questionId: string;
  value: any;
  status: QuestionStatus;
  errorMessage?: string;
}

export interface SurveyState {
  entity: Entity | null;
  clues: Clues | null;
  role: UserRole;
  answers: Record<string, any>;
  lastSavedAt: string | null;
  isCompleted: boolean;
  submissionId: string | null;
}

export interface SubmissionSection {
  sectionId: string;
  sectionTitle: string;
  answers: Record<string, any>;
}

export interface SurveySubmission {
  submissionId: string;
  submittedAt: string;
  entityId: string;
  entityName: string;
  cluesCode: string;
  hospitalName: string;
  regionName?: string;
  role: UserRole;
  totalQuestions: number;
  answeredQuestions: number;
  answers: Record<string, any>;
  answersBySection: SubmissionSection[];
  storageMethod: 'google_sheets' | 'local_backup';
}

