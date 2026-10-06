import { SurveyState, SurveySubmission } from '../types/questionnaire';

const STORAGE_KEY_STATE = 'imss_bienestar_survey_draft';
const STORAGE_KEY_SUBMISSIONS = 'imss_bienestar_survey_submissions';

type StoredSubmission = SurveySubmission & { syncStatus?: 'pending' | 'synced' };

export const storageService = {
  saveDraft(state: Partial<SurveyState>): void {
    try {
      const dataToSave = {
        ...state,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(dataToSave));
    } catch (err) {
      console.warn('No se pudo guardar borrador local en localStorage:', err);
    }
  },

  loadDraft(): Partial<SurveyState> | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STATE);
      if (!data) return null;
      return JSON.parse(data);
    } catch (err) {
      console.error('Error al cargar borrador:', err);
      return null;
    }
  },

  clearDraft(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_STATE);
    } catch (err) {
      console.error('Error al limpiar borrador:', err);
    }
  },

  saveSubmissionSnapshot(submission: SurveySubmission): void {
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      const list: StoredSubmission[] = existingStr ? JSON.parse(existingStr) : [];
      const existingIndex = list.findIndex((item) => item.submissionId === submission.submissionId);
      const storedSubmission: StoredSubmission = { ...submission, syncStatus: 'pending' };
      if (existingIndex === -1) list.push(storedSubmission);
      else list[existingIndex] = storedSubmission;
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
    } catch (err) {
      console.error('Error al respaldar sincronización pendiente:', err);
      throw err;
    }
  },

  saveCompletedSubmission(submission: SurveySubmission): void {
    this.saveSubmissionSnapshot({ ...submission, submissionStatus: 'completed' });
  },

  getSubmissions(): SurveySubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getPendingSubmissions(): SurveySubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      const submissions: StoredSubmission[] = data ? JSON.parse(data) : [];
      return submissions.filter((item) => item.syncStatus !== 'synced');
    } catch {
      return [];
    }
  },

  markSubmissionSynced(submissionId: string, submittedAt: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      const submissions: StoredSubmission[] = data ? JSON.parse(data) : [];
      localStorage.setItem(
        STORAGE_KEY_SUBMISSIONS,
        JSON.stringify(
          submissions.map((item) =>
            item.submissionId === submissionId && item.submittedAt === submittedAt
              ? { ...item, syncStatus: 'synced' }
              : item
          )
        )
      );
    } catch (err) {
      console.warn('No se pudo actualizar el estado de sincronización local:', err);
    }
  },

};
