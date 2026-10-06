/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Entity, Clues, Question, UserRole, SurveySubmission } from './types/questionnaire';
import { QUESTIONS_CATALOG, getActiveQuestions } from './data/questions';
import { calculateSurveyProgress } from './utils/progress';
import { storageService } from './services/storage';
import { googleSheetsService } from './services/googleSheets';
import { buildRegionalClues, getRegionsForEntity } from './data/notebookCatalog';

import { Header } from './components/layout/Header';
import { BackgroundDecoration } from './components/layout/BackgroundDecoration';
import { CoverStage } from './components/onboarding/CoverStage';
import { InstructionsStage } from './components/onboarding/InstructionsStage';
import { EntityCluesSelector } from './components/entity-selector/EntityCluesSelector';
import { CaptureTable } from './components/questionnaire/CaptureTable';
import { ReviewStage } from './components/questionnaire/ReviewStage';
import { SuccessStage } from './components/questionnaire/SuccessStage';
import { FormLoadingOverlay } from './components/layout/FormLoadingOverlay';

type AppStage = 'cover' | 'instructions' | 'selector' | 'capture' | 'review' | 'success';
const APP_STAGES: AppStage[] = ['cover', 'instructions', 'selector', 'capture', 'review', 'success'];

const isAppStage = (value: unknown): value is AppStage =>
  typeof value === 'string' && APP_STAGES.includes(value as AppStage);

const checkInternetConnection = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(`https://www.gstatic.com/generate_204?check=${Date.now()}`, {
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });
    return navigator.onLine;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const createSubmissionId = (): string =>
  `IMSSB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

const ageRange = (value: unknown): string => {
  const age = Number(value);
  return age < 40 ? 'Menos de 40' : age < 50 ? '40 a 49' : age < 60 ? '50 a 59' : '60 o más';
};

const getQuestionsForRole = (
  role: UserRole,
  answers: Record<string, any>,
  entityId: string | undefined
): Question[] => getActiveQuestions(role, answers).map((question) =>
  question.id === 'A2_coord'
    ? {
        ...question,
        options: getRegionsForEntity(entityId || '').map((region) => ({ value: region, label: region })),
      }
    : question
);

const groupAnswersBySection = (
  questions: Question[],
  answers: Record<string, any>
): SurveySubmission['answersBySection'] => {
  const sections = new Map<string, SurveySubmission['answersBySection'][number]>();
  for (const question of questions) {
    let section = sections.get(question.sectionId);
    if (!section) {
      section = { sectionId: question.sectionId, sectionTitle: question.sectionTitle, answers: {} };
      sections.set(question.sectionId, section);
    }
    const answer = answers[question.id];
    section.answers[question.id] = question.id === 'A3' && answer !== undefined && answer !== null && answer !== ''
      ? ageRange(answer)
      : answer ?? '';
  }
  return Array.from(sections.values());
};

const buildSubmissionSnapshot = (
  submissionId: string,
  entity: Entity,
  clues: Clues,
  role: UserRole,
  questions: Question[],
  answers: Record<string, any>,
  submissionStatus: 'draft' | 'completed'
): SurveySubmission => {
  const progress = calculateSurveyProgress(questions, answers);
  const reportedAnswers = Object.fromEntries(
    Object.entries(answers).filter(([key]) => !key.endsWith('__confirmed'))
  );
  if (reportedAnswers.A3 !== undefined && reportedAnswers.A3 !== null && reportedAnswers.A3 !== '') {
    reportedAnswers.A3 = ageRange(reportedAnswers.A3);
  }
  const regionName = role === 'coordinador' ? String(answers.A2_coord || '') : clues.region;

  return {
    submissionId,
    submittedAt: new Date().toISOString(),
    entityId: entity.id,
    entityName: entity.name,
    cluesCode: role === 'director' ? clues.clues : '',
    hospitalName: role === 'director' ? clues.name : 'Coordinación regional',
    regionName,
    role,
    totalQuestions: progress.total,
    answeredQuestions: progress.answered,
    answers: reportedAnswers,
    answersBySection: groupAnswersBySection(questions, answers),
    submissionStatus,
    storageMethod: 'local_backup',
  };
};

export default function App() {
  const [stage, setStage] = useState<AppStage>('cover');
  const [entity, setEntity] = useState<Entity | null>(null);
  const [clues, setClues] = useState<Clues | null>(null);
  const [role, setRole] = useState<UserRole>('director');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [completedSubmission, setCompletedSubmission] = useState<SurveySubmission | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoReviewDoneRef = useRef(false);
  const syncInProgressRef = useRef(false);
  const databaseConnectedRef = useRef(false);

  const syncPendingSubmissions = useCallback(async () => {
    setPendingSyncCount(storageService.getPendingSubmissions().length);
    if (!navigator.onLine || !googleSheetsService.isConfigured() || syncInProgressRef.current) {
      databaseConnectedRef.current = false;
      setIsDatabaseConnected(false);
      return;
    }

    syncInProgressRef.current = true;
    try {
      const connected = databaseConnectedRef.current || await googleSheetsService.checkConnection();
      databaseConnectedRef.current = connected;
      setIsDatabaseConnected(connected);
      if (!connected) return;

      while (navigator.onLine) {
        const submission = storageService.getPendingSubmissions()[0];
        if (!submission) break;
        if (!navigator.onLine) {
          databaseConnectedRef.current = false;
          setIsDatabaseConnected(false);
          break;
        }
        const delivered = await googleSheetsService.sendSubmission(submission);
        if (!delivered) {
          databaseConnectedRef.current = false;
          setIsDatabaseConnected(false);
          break;
        }
        storageService.markSubmissionSynced(submission.submissionId, submission.submittedAt);
      }
    } finally {
      syncInProgressRef.current = false;
      setPendingSyncCount(storageService.getPendingSubmissions().length);
    }
  }, []);

  const goToStage = useCallback((nextStage: AppStage, replace = false) => {
    const nextUrl = `${window.location.pathname}${window.location.search}#${nextStage}`;
    const nextHistoryState = { ...window.history.state, questionnaireStage: nextStage };
    if (replace) {
      window.history.replaceState(nextHistoryState, '', nextUrl);
    } else {
      window.history.pushState(nextHistoryState, '', nextUrl);
    }
    setStage(nextStage);
    setIsLoadingForm(nextStage === 'capture');
  }, []);

  useEffect(() => {
    const initialUrl = `${window.location.pathname}${window.location.search}#cover`;
    window.history.replaceState(
      { ...window.history.state, questionnaireStage: 'cover' },
      '',
      initialUrl
    );

    const handlePopState = (event: PopStateEvent) => {
      const nextStage = event.state?.questionnaireStage;
      if (!isAppStage(nextStage)) {
        setStage('cover');
        setIsLoadingForm(false);
        return;
      }
      setStage(nextStage);
      setIsLoadingForm(nextStage === 'capture');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const draft = storageService.loadDraft();
    if (!draft?.submissionId || !draft.entity || !draft.clues || !draft.answers) return;

    setEntity(draft.entity);
    setClues(draft.clues);
    setRole(draft.role || 'director');
    setSubmissionId(draft.submissionId);
    setAnswers(draft.answers);
    autoReviewDoneRef.current = false;
    goToStage('capture', true);
  }, [goToStage]);

  useEffect(() => {
    const draft = storageService.loadDraft();
    if (!draft?.submissionId || !draft.entity || !draft.clues || !draft.answers) return;

    setEntity(draft.entity);
    setClues(draft.clues);
    setRole(draft.role || 'director');
    setSubmissionId(draft.submissionId);
    setAnswers(draft.answers);
    autoReviewDoneRef.current = false;
    goToStage('capture', true);
  }, [goToStage]);

  useEffect(() => {
    let isCurrent = true;
    const updateConnectivity = async () => {
      const connected = await checkInternetConnection();
      if (!isCurrent) return;
      setIsOnline(connected);
      if (connected) void syncPendingSubmissions();
    };
    const handleOffline = () => {
      setIsOnline(false);
      databaseConnectedRef.current = false;
      setIsDatabaseConnected(false);
    };

    window.addEventListener('online', updateConnectivity);
    window.addEventListener('offline', handleOffline);
    void updateConnectivity();
    const intervalId = window.setInterval(updateConnectivity, 30000);

    return () => {
      isCurrent = false;
      window.clearInterval(intervalId);
      window.removeEventListener('online', updateConnectivity);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingSubmissions]);

  useEffect(() => {
    const requiresSelection = stage === 'capture' || stage === 'review' || stage === 'success';
    const isMissingSubmission = stage === 'success' && !completedSubmission;
    if (requiresSelection && (!entity || !clues || isMissingSubmission)) {
      goToStage('cover', true);
    }
  }, [stage, entity, clues, completedSubmission, goToStage]);

  useEffect(() => {
    if (stage !== 'capture' || !isLoadingForm) return;
    const timeoutId = window.setTimeout(() => setIsLoadingForm(false), 1300);
    return () => window.clearTimeout(timeoutId);
  }, [stage, isLoadingForm]);

  // Compute active questions based on current role and answers
  const activeQuestions = useMemo(() => {
    return getQuestionsForRole(role, answers, entity?.id);
  }, [role, answers, entity?.id]);

  // Compute progress summary
  const progress = useMemo(() => {
    return calculateSurveyProgress(activeQuestions, answers);
  }, [activeQuestions, answers]);

  useEffect(() => {
    if (
      stage === 'capture' &&
      !isLoadingForm &&
      editingQuestionId === null &&
      progress.total > 0 &&
      progress.canSubmit &&
      !autoReviewDoneRef.current
    ) {
      autoReviewDoneRef.current = true;
      goToStage('review');
    }
  }, [stage, isLoadingForm, editingQuestionId, progress, goToStage]);

  // Count captured answers
  const capturedAnswersCount = useMemo(() => {
    return Object.keys(answers).filter((k) => {
      if (k.endsWith('__confirmed')) return false;
      const val = answers[k];
      return val !== undefined && val !== null && val !== '';
    }).length;
  }, [answers]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback(
    (
      newAnswers: Record<string, any>,
      currentEnt: Entity | null,
      currentClues: Clues | null,
      currentRole: UserRole,
      currentSubmissionId: string
    ) => {
      setSaveStatus('saving');
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        try {
          storageService.saveDraft({
            entity: currentEnt,
            clues: currentClues,
            role: currentRole,
            answers: newAnswers,
            isCompleted: false,
            submissionId: currentSubmissionId,
          });

          const hasAnsweredQuestion = Object.entries(newAnswers).some(([key, value]) =>
            !key.endsWith('__confirmed') &&
            value !== undefined &&
            value !== null &&
            value !== '' &&
            (!Array.isArray(value) || value.length > 0)
          );
          const identityReady = currentRole === 'coordinador'
            ? Boolean(newAnswers.A2_coord)
            : Boolean(currentClues?.clues);

          if (currentEnt && currentClues && currentSubmissionId && hasAnsweredQuestion && identityReady) {
            const questions = getQuestionsForRole(currentRole, newAnswers, currentEnt.id);
            storageService.saveSubmissionSnapshot(
              buildSubmissionSnapshot(
                currentSubmissionId,
                currentEnt,
                currentClues,
                currentRole,
                questions,
                newAnswers,
                'draft'
              )
            );
            setPendingSyncCount(storageService.getPendingSubmissions().length);
            void syncPendingSubmissions();
          }
          setSaveStatus('saved');
        } catch (e) {
          console.error('Error auto-saving:', e);
          setSaveStatus('error');
        }
      }, 500);
    },
    [syncPendingSubmissions]
  );

  // Handle single question answer update
  const handleAnswerChange = (questionId: string, value: any) => {
    setEditingQuestionId(null);
    autoReviewDoneRef.current = false;
    const currentClues = questionId === 'A2_coord' && entity && typeof value === 'string'
      ? buildRegionalClues(entity.id, value)
      : clues;
    if (questionId === 'A2_coord' && currentClues !== clues) setClues(currentClues);
    const currentSubmissionId = submissionId || createSubmissionId();
    if (!submissionId) setSubmissionId(currentSubmissionId);
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: value,
      };
      const questionType = activeQuestions.find((question) => question.id === questionId)?.type;
      if (['multiple', 'number', 'short_text', 'long_text', 'amount_conditional'].includes(questionType || '')) {
        updated[`${questionId}__confirmed`] = false;
      }

      // Sync role if A1 is answered
      let newRole = role;
      if (questionId === 'A1' && (value === 'director' || value === 'coordinador')) {
        newRole = value;
        setRole(value);
      }

      triggerAutoSave(updated, entity, currentClues, newRole, currentSubmissionId);
      return updated;
    });
  };

  const handleAnswerConfirmation = (questionId: string, confirmed: boolean) => {
    const currentSubmissionId = submissionId || createSubmissionId();
    if (!submissionId) setSubmissionId(currentSubmissionId);
    setAnswers((prev) => {
      const updated = { ...prev, [`${questionId}__confirmed`]: confirmed };
      triggerAutoSave(updated, entity, clues, role, currentSubmissionId);
      return updated;
    });
  };

  // Confirm entity and clues selection
  const handleConfirmInstitutionalSelection = (newEntity: Entity, newClues: Clues, newRole: UserRole) => {
    const sameSubmission = entity?.id === newEntity.id && clues?.clues === newClues.clues && submissionId;
    const currentSubmissionId = sameSubmission || createSubmissionId();
    setEntity(newEntity);
    setClues(newClues);
    setRole(newRole);
    setSubmissionId(currentSubmissionId);
    autoReviewDoneRef.current = false;

    setAnswers((prev) => {
      const updated = { ...prev };
      triggerAutoSave(updated, newEntity, newClues, newRole, currentSubmissionId);
      return updated;
    });

    goToStage('capture');
  };

  // Final submission handler
  const handleFinalSubmit = async () => {
    if (!entity || !clues) return;
    setIsSubmitting(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const currentSubmissionId = submissionId || createSubmissionId();
    setSubmissionId(currentSubmissionId);
    const submissionPayload = buildSubmissionSnapshot(
      currentSubmissionId,
      entity,
      clues,
      role,
      activeQuestions,
      answers,
      'completed'
    );

    try {
      storageService.saveSubmissionSnapshot(submissionPayload);
      setPendingSyncCount(storageService.getPendingSubmissions().length);
      setCompletedSubmission(submissionPayload);

      // Clean local draft after completed submission
      storageService.clearDraft();

      goToStage('success');
      void syncPendingSubmissions();
    } catch (err: any) {
      console.error('Error in submission:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Jump from review directly to a question in capture stage
  const handleGoToQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
    autoReviewDoneRef.current = false;
    goToStage('capture');

    // Scroll smoothly to target element after DOM update
    setTimeout(() => {
      const el = document.getElementById(`question_${questionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Reset questionnaire to start fresh
  const handleResetSurvey = () => {
    storageService.clearDraft();
    setEntity(null);
    setClues(null);
    setAnswers({});
    setRole('director');
    setSubmissionId(null);
    setCompletedSubmission(null);
    setEditingQuestionId(null);
    autoReviewDoneRef.current = false;
    goToStage('cover', true);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative font-sans antialiased">
      {/* Background with photo and dark institutional overlay */}
      <BackgroundDecoration stage={stage} />

      {/* Institutional Top Navigation Header */}
      <Header
        saveStatus={saveStatus}
        currentStage={stage}
        isOnline={isOnline}
        isDatabaseConnected={isDatabaseConnected}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Content Area based on Stage */}
      <main className="flex-1">
        {stage === 'cover' && (
          <CoverStage
            onStart={() => goToStage('instructions')}
          />
        )}

        {stage === 'instructions' && (
          <InstructionsStage
            onContinue={() => goToStage('selector')}
            onBack={() => goToStage('cover')}
          />
        )}

        {stage === 'selector' && (
          <EntityCluesSelector
            selectedEntity={entity}
            selectedClues={clues}
            currentRole={role}
            capturedAnswersCount={capturedAnswersCount}
            onConfirmSelection={handleConfirmInstitutionalSelection}
            onBack={() => goToStage('instructions')}
          />
        )}

        {stage === 'capture' && entity && clues && (
          <CaptureTable
            entity={entity}
            clues={clues}
            role={role}
            questions={activeQuestions}
            answers={answers}
            progress={progress}
            editingQuestionId={editingQuestionId}
            onAnswerChange={handleAnswerChange}
            onConfirmAnswer={handleAnswerConfirmation}
            onGoToReview={() => goToStage('review')}
            onBackToSelector={() => goToStage('selector')}
          />
        )}

        {stage === 'review' && entity && clues && (
          <ReviewStage
            entity={entity}
            clues={clues}
            role={role}
            questions={activeQuestions}
            answers={answers}
            progress={progress}
            isSubmitting={isSubmitting}
            onBackToCapture={() => {
              setEditingQuestionId(null);
              goToStage('capture');
            }}
            onGoToQuestion={handleGoToQuestion}
            onSubmit={handleFinalSubmit}
          />
        )}

        {stage === 'success' && completedSubmission && (
          <SuccessStage
            submission={completedSubmission}
            onReset={handleResetSurvey}
          />
        )}
      </main>
      <FormLoadingOverlay visible={isLoadingForm} />
    </div>
  );
}
