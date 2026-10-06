import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Question, Entity, Clues, UserRole } from '../../types/questionnaire';
import { ProgressSummary } from '../../utils/progress';
import { SingleChoiceControl } from './QuestionControls/SingleChoiceControl';
import { MultipleChoiceControl } from './QuestionControls/MultipleChoiceControl';
import { MatrixControl } from './QuestionControls/MatrixControl';
import { RankedSelectControl } from './QuestionControls/RankedSelectControl';
import { AmountConditionalControl } from './QuestionControls/AmountConditionalControl';
import { NumberControl } from './QuestionControls/NumberControl';
import { TextControl } from './QuestionControls/TextControl';

interface CaptureTableProps {
  entity: Entity;
  clues: Clues;
  role: UserRole;
  questions: Question[];
  answers: Record<string, any>;
  progress: ProgressSummary;
  editingQuestionId: string | null;
  onAnswerChange: (questionId: string, value: any) => void;
  onConfirmAnswer: (questionId: string, confirmed: boolean) => void;
  onGoToReview: () => void;
  onBackToSelector: () => void;
}

export const CaptureTable: React.FC<CaptureTableProps> = ({
  entity,
  clues,
  role,
  questions,
  answers,
  progress,
  editingQuestionId,
  onAnswerChange,
  onConfirmAnswer,
  onGoToReview,
  onBackToSelector,
}) => {
  // Group questions by section
  const sections = useMemo(() => {
    const map = new Map<string, { id: string; title: string; description?: string; questions: Question[] }>();

    for (const q of questions) {
      if (!map.has(q.sectionId)) {
        map.set(q.sectionId, {
          id: q.sectionId,
          title: q.sectionTitle,
          description: q.sectionDescription,
          questions: [],
        });
      }
      map.get(q.sectionId)!.questions.push(q);
    }

    return Array.from(map.values());
  }, [questions]);

  // Keep completed questions out of the capture flow unless the user chose to edit one.
  const filteredSections = useMemo(() => {
    return sections
      .map((sec) => ({
        ...sec,
        questions: sec.questions.filter((q) => {
          const status = progress.questionStatuses[q.id]?.status;
          const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
          return (
            status === 'pending' ||
            status === 'error' ||
            (!q.required && !hasAnswer) ||
            q.id === editingQuestionId
          );
        }),
      }))
      .filter((sec) => sec.questions.length > 0);
  }, [sections, answers, editingQuestionId, progress.questionStatuses]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Institutional Context Header Card */}
      <div className="institutional-glass rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-1 sm:mt-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {role === 'director' ? (
                <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700/50">
                  CLUES: {clues.clues}
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-200 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700/50">
                  Región: {answers.A2_coord || 'Pendiente de seleccionar'}
                </span>
              )}
              <span className="text-xs text-slate-300 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                {entity.name}
              </span>
              <span className="text-[11px] text-amber-300 font-semibold px-2 py-0.5 rounded bg-black/40 border border-amber-500/20">
                {role === 'director' ? 'Director(a) de hospital' : 'Coordinador(a) regional'}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-1">
              {role === 'director' ? clues.name : `Hospitales de ${answers.A2_coord || 'la región seleccionada'}`}
            </h2>
          </div>
        </div>

        <button
          onClick={onBackToSelector}
          className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 transition-colors cursor-pointer self-end md:self-auto"
        >
          {role === 'director' ? 'Cambiar hospital / entidad' : 'Cambiar entidad'}
        </button>
      </div>

      {/* Progress & Filter Bar (Sticky on scroll) */}
      <div className="sticky top-16 z-30 institutional-glass-subtle rounded-2xl p-4 sm:p-5 border border-emerald-600/30 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center text-emerald-300 font-semibold space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{progress.answered} respondidas</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center text-amber-300 font-semibold space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{progress.pending} pendientes</span>
            </span>
            {progress.errorCount > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center text-rose-300 font-semibold space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{progress.errorCount} con error</span>
                </span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{progress.total} preguntas totales</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToReview}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer ml-auto shrink-0"
            >
              <span>Revisar y Enviar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Questionnaire Capture Table Container */}
      <div className="space-y-8">
        {filteredSections.length === 0 ? (
          <div className="institutional-glass rounded-2xl p-10 text-center text-slate-300 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">¡No hay preguntas pendientes!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Ha respondido satisfactoriamente todas las preguntas activas. Se abrirá el resumen detallado para revisar sus respuestas.
            </p>
            <div className="pt-2">
              <button
                onClick={onGoToReview}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold cursor-pointer"
              >
                Continuar a Revisión
              </button>
            </div>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div
              key={section.id}
              className="institutional-glass rounded-2xl border border-emerald-900/40 overflow-hidden shadow-2xl"
            >
              {/* Section Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#003832] to-[#012622] border-b border-emerald-800/40">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Desktop Table Header (Pregunta | Respuesta) */}
              <div className="hidden lg:grid grid-cols-12 bg-black/40 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10 px-6 py-3">
                <div className="col-span-5 flex items-center space-x-2">
                  <span>Pregunta Oficial</span>
                </div>
                <div className="col-span-7 flex items-center space-x-2">
                  <span>Respuesta / Control de Captura</span>
                </div>
              </div>

              {/* Question Rows */}
              <div className="divide-y divide-white/10">
                {section.questions.map((question, qIdx) => {
                  const statusInfo = progress.questionStatuses[question.id] || { status: 'pending' };
                  const currentAns = answers[question.id];
                  const questionText =
                    role === 'coordinador' && question.coordinatorText
                      ? question.coordinatorText
                      : question.text;
                  const displayQuestionId = question.roleDisplayIds?.[role] || question.id;

                  const statusConfig = {
                    answered: {
                      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                      label: 'Respondida',
                      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/30',
                      borderClass: 'border-l-4 border-l-emerald-500',
                    },
                    pending: {
                      icon: <Clock className="w-4 h-4 text-amber-400" />,
                      label: question.required ? 'Pendiente' : 'Opcional',
                      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-600/30',
                      borderClass: 'border-l-4 border-l-amber-500/70',
                    },
                    error: {
                      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
                      label: 'Incompleta / Error',
                      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-600/30',
                      borderClass: 'border-l-4 border-l-rose-500',
                    },
                  }[statusInfo.status];

                  return (
                    <div
                      key={question.id}
                      id={`question_${question.id}`}
                      className={`p-4 sm:p-6 transition-colors ${statusConfig.borderClass} ${
                        qIdx % 2 === 0 ? 'bg-black/10' : 'bg-transparent'
                      } hover:bg-emerald-950/15`}
                    >
                      {/* Responsive Grid: In desktop col-span-5 & col-span-7; in mobile vertical stack */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                        {/* Columna Izquierda: Pregunta Oficial e Indicador de Estado */}
                        <div className="lg:col-span-5 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                              {displayQuestionId}
                            </span>

                            {question.required ? (
                              <span className="text-[10px] font-semibold text-rose-300 uppercase px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/40">
                                Obligatoria
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 uppercase px-1.5 py-0.2 rounded bg-slate-800">
                                Opcional
                              </span>
                            )}

                            {/* Badge de estado con icono y texto */}
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.badgeClass}`}
                            >
                              {statusConfig.icon}
                              <span>{statusConfig.label}</span>
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                            {questionText}
                          </h4>

                          {question.help && (
                            <p className="text-xs text-slate-400 leading-relaxed flex items-start space-x-1.5 pt-1">
                              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <span>{question.help}</span>
                            </p>
                          )}
                        </div>

                        {/* Columna Derecha: Control de Captura Específico */}
                        <div className="lg:col-span-7 space-y-2">
                          {/* Selector según el tipo exacto */}
                          {question.type === 'single' && question.options && (
                            <SingleChoiceControl
                              questionId={question.id}
                              options={question.options}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                            />
                          )}

                          {question.type === 'multiple' && question.options && (
                            <MultipleChoiceControl
                              questionId={question.id}
                              options={question.options}
                              maxSelections={question.validation?.maxSelections}
                              exactSelectionCount={question.validation?.exactSelectionCount}
                              requiresConfirmation={question.validation?.requiresConfirmation}
                              isConfirmed={answers[`${question.id}__confirmed`] === true}
                              onConfirm={(confirmed) => onConfirmAnswer(question.id, confirmed)}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                            />
                          )}

                          {question.type === 'matrix' && question.matrixItems && question.matrixColumns && (
                            <MatrixControl
                              questionId={question.id}
                              items={question.matrixItems}
                              columns={question.matrixColumns}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                            />
                          )}

                          {question.type === 'ranked_select' && question.options && (
                            <RankedSelectControl
                              questionId={question.id}
                              options={question.options}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                            />
                          )}

                          {question.type === 'amount_conditional' && (
                            <AmountConditionalControl
                              questionId={question.id}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                              onConfirm={() => onConfirmAnswer(question.id, true)}
                            />
                          )}

                          {question.type === 'number' && (
                            <NumberControl
                              questionId={question.id}
                              value={currentAns}
                              min={question.validation?.min}
                              max={question.validation?.max}
                              onChange={(val) => onAnswerChange(question.id, val)}
                              onConfirm={() => onConfirmAnswer(question.id, true)}
                            />
                          )}

                          {(question.type === 'long_text' || question.type === 'short_text') && (
                            <TextControl
                              questionId={question.id}
                              isLong={question.type === 'long_text'}
                              maxLength={question.validation?.maxLength}
                              value={currentAns}
                              onChange={(val) => onAnswerChange(question.id, val)}
                              onConfirm={() => onConfirmAnswer(question.id, true)}
                            />
                          )}

                          {/* Mensaje de error específico si existe */}
                          {statusInfo.status === 'error' && statusInfo.errorMessage && (
                            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-start space-x-2 text-xs text-rose-200 mt-2 animate-fadeIn">
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              <span className="font-medium">{statusInfo.errorMessage}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer bar with button to review */}
      <div className="p-4 sm:p-6 institutional-glass rounded-2xl flex justify-end border border-emerald-600/30 shadow-2xl">
        <button
          onClick={onGoToReview}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Ir a Revisión y Envío</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
