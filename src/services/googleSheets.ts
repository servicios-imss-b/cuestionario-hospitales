import { SurveySubmission } from '../types/questionnaire';
import { QUESTIONS_CATALOG } from '../data/questions';

const getEndpoint = (): string => import.meta.env.VITE_GOOGLE_SHEETS_ENDPOINT?.trim() || '';
const questionSchema = QUESTIONS_CATALOG.flatMap((question) => [
  [question.id, question.sectionId],
  ...Object.values(question.roleSectionIds || {}).map((sectionId) => [question.id, sectionId]),
]);
let hasSyncedQuestionSchema = false;

export const googleSheetsService = {
  isConfigured(): boolean {
    const endpoint = getEndpoint();
    return endpoint.startsWith('https://script.google.com/macros/s/') && !endpoint.includes('YOUR_APPS_SCRIPT_ID');
  },

  checkConnection(): Promise<boolean> {
    if (!this.isConfigured()) return Promise.resolve(false);

    return new Promise((resolve) => {
      const callbackName = `__sheetsHealth_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const callbackWindow = window as unknown as Record<string, unknown>;
      const script = document.createElement('script');
      let settled = false;
      let timeoutId: number;

      const cleanup = () => {
        window.clearTimeout(timeoutId);
        script.remove();
        delete callbackWindow[callbackName];
      };
      const finish = (connected: boolean) => {
        if (settled) {
          cleanup();
          return;
        }
        settled = true;
        cleanup();
        resolve(connected);
      };

      const schema = hasSyncedQuestionSchema
        ? ''
        : `&schema=${encodeURIComponent(JSON.stringify(questionSchema))}`;
      callbackWindow[callbackName] = (result: { connected?: boolean; schemaSynced?: boolean }) => {
        const connected = result?.connected === true;
        if (connected && (!schema || result.schemaSynced === true)) hasSyncedQuestionSchema = true;
        finish(connected);
      };
      script.onerror = () => finish(false);
      script.onload = () => finish(false);
      timeoutId = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        resolve(false);
      }, 30000);
      const separator = getEndpoint().includes('?') ? '&' : '?';
      script.src = `${getEndpoint()}${separator}action=health${schema}&callback=${callbackName}`;
      document.head.appendChild(script);
    });
  },

  sendSubmission(submission: SurveySubmission): Promise<boolean> {
    if (!this.isConfigured()) return Promise.resolve(false);

    return new Promise((resolve) => {
      const requestId = `submission_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const targetName = `sheets_${requestId}`;
      const iframe = document.createElement('iframe');
      const form = document.createElement('form');
      const payload = document.createElement('input');
      let settled = false;

      iframe.name = targetName;
      iframe.title = 'Confirmación de sincronización';
      iframe.hidden = true;
      form.method = 'POST';
      form.target = targetName;
      form.action = `${getEndpoint()}?requestId=${requestId}`;
      form.hidden = true;
      payload.type = 'hidden';
      payload.name = 'payload';
      payload.value = JSON.stringify({ ...submission, answers: undefined });
      form.appendChild(payload);

      const finish = (sent: boolean) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        window.removeEventListener('message', handleMessage);
        form.remove();
        iframe.remove();
        resolve(sent);
      };

      const handleMessage = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow || event.data?.requestId !== requestId) return;
        finish(event.data.ok === true);
      };

      const timeoutId = window.setTimeout(() => finish(false), 20000);
      window.addEventListener('message', handleMessage);
      document.body.append(iframe, form);
      form.submit();
    });
  },
};