import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  MapPin,
  ArrowLeft,
  Send,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';
import { Question, Entity, Clues, UserRole } from '../../types/questionnaire';
import { ProgressSummary } from '../../utils/progress';

interface ReviewStageProps {
  entity: Entity;
  clues: Clues;
  role: UserRole;
  questions: Question[];
  answers: Record<string, any>;
  progress: ProgressSummary;
  isSubmitting: boolean;
  onBackToCapture: () => void;
  onGoToQuestion: (questionId: string) => void;
  onSubmit: () => void;
}

export const ReviewStage: React.FC<ReviewStageProps> = ({
  entity,
  clues,
  role,
  questions,
  answers,
  progress,
  isSubmitting,
  onBackToCapture,
  onGoToQuestion,
  onSubmit,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Group questions by section for clean structured review
  const sectionsMap = new Map<string, { id: string; title: string; questions: Question[] }>();
  for (const q of questions) {
    if (!sectionsMap.has(q.sectionId)) {
      sectionsMap.set(q.sectionId, {
        id: q.sectionId,
        title: q.sectionTitle,
        questions: [],
      });
    }
    sectionsMap.get(q.sectionId)!.questions.push(q);
  }
  const sectionsList = Array.from(sectionsMap.values());

  // Questions with error or missing required
  const pendingOrErrorQuestions = questions.filter((q) => {
    const status = progress.questionStatuses[q.id]?.status;
    return status === 'pending' || status === 'error';
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Institutional Review Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="institutional-glass rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl"
      >
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Fase de Validación y Revisión Previa al Envío</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Resumen General del Cuestionario
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Verifique el resumen de datos institucionales y el estado de cada sección antes del registro final. Si desea corregir alguna respuesta, puede regresar directamente a la pregunta.
        </p>

        {/* Institutional Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Entidad Federativa</span>
              <p className="text-sm font-bold text-white mt-0.5">{entity.name}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {role === 'director' ? 'Establecimiento Médico' : 'Región'}
              </span>
              <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                {role === 'director' ? clues.name : answers.A2_coord}
              </p>
              {role === 'director' && (
                <span className="text-[11px] text-emerald-400 font-mono">CLUES: {clues.clues}</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Perfil del Informante</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {role === 'director' ? 'Director(a) de hospital' : 'Coordinador(a) regional'}
              </p>
              <span className="text-[11px] text-emerald-300">Cuestionario Anónimo</span>
            </div>
          </div>
        </div>

        {/* Progress Metrics Overview */}
        <div className="p-5 rounded-xl bg-black/50 border border-emerald-900/40">
          <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 flex items-center space-x-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{progress.answered} respondidas</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-600/40 flex items-center space-x-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{progress.pending} pendientes</span>
              </span>
              {progress.errorCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-600/40 flex items-center space-x-1.5 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{progress.errorCount} con errores</span>
                </span>
              )}
              <span className="text-slate-400">Total: {progress.total} preguntas</span>
          </div>
        </div>

        {/* Pending questions warning block if incomplete */}
        {!progress.canSubmit && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 space-y-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Atención: No es posible enviar el cuestionario aún
                </h4>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Existen <strong>{pendingOrErrorQuestions.length} preguntas obligatorias</strong> que requieren respuesta o revisión de rango antes del envío:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {pendingOrErrorQuestions.map((q) => {
                const status = progress.questionStatuses[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => onGoToQuestion(q.id)}
                    className="p-2.5 rounded-lg bg-black/50 hover:bg-black/80 border border-amber-500/30 text-left text-xs transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="truncate mr-2">
                      <span className="font-mono font-bold text-amber-300 mr-1.5">[{q.id}]</span>
                      <span className="text-slate-300 group-hover:text-white truncate">
                        {q.text}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 group-hover:underline shrink-0">
                      Responder →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Structured Sections Audit List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
          Detalle por Sección
        </h3>

        {sectionsList.map((sec) => {
          const secPendingCount = sec.questions.filter((q) => {
            const st = progress.questionStatuses[q.id]?.status;
            return st === 'pending' || st === 'error';
          }).length;
          const secAnsweredCount = sec.questions.length - secPendingCount;

          return (
            <div
              key={sec.id}
              className="institutional-glass rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="p-4 bg-black/30 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                  <span className="text-[11px] text-slate-400">
                    {secAnsweredCount} de {sec.questions.length} respondidas
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    secPendingCount === 0
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/30'
                      : 'bg-amber-950/80 text-amber-300 border-amber-600/30'
                  }`}
                >
                  {secPendingCount === 0 ? 'Completa' : `${secPendingCount} pendientes`}
                </span>
              </div>

              <div className="p-4 divide-y divide-white/5 space-y-2 text-xs">
                {sec.questions.map((q) => {
                  const statusInfo = progress.questionStatuses[q.id] || { status: 'pending' };
                  const val = answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="pt-2 flex items-start justify-between gap-4 first:pt-0"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-emerald-400">[{q.roleDisplayIds?.[role] || q.id}]</span>
                          <span className="font-medium text-slate-200">{q.text}</span>
                        </div>
                        {val !== undefined && val !== null && val !== '' ? (
                          <div className="text-[11px] text-slate-400 pl-6">
                            Respuesta:{' '}
                            <span className="text-emerald-200 font-mono">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-400/90 pl-6">
                            {q.required ? 'Esta pregunta es obligatoria. Selecciona una opción para continuar.' : 'Sin respuesta (Opcional)'}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onGoToQuestion(q.id)}
                        className="text-xs text-emerald-400 hover:text-emerald-200 flex items-center space-x-1 shrink-0 p-1 hover:underline cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modificar</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-5 institutional-glass rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-600/30 shadow-2xl">
        <button
          onClick={onBackToCapture}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-700/50 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Regresar a la Tabla de Captura</span>
        </button>

        <button
          disabled={!progress.canSubmit || isSubmitting}
          onClick={() => setShowConfirmModal(true)}
          className={`w-full sm:w-auto px-9 py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-xl transition-all flex items-center justify-center space-x-2.5 ${
            progress.canSubmit && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-emerald-950/50 transform hover:-translate-y-0.5'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Registrando...' : 'Enviar Cuestionario Definitivo'}</span>
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN PREVIO AL ENVÍO DEFINITIVO */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full institutional-glass rounded-2xl p-6 sm:p-7 border border-emerald-500/50 text-slate-100 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Send className="w-5 h-5" />
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  ¿Desea enviar el cuestionario?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Una vez enviado, la información quedará registrada formalmente en el sistema institucional.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Entidad:</span>
                  <p className="font-bold text-white">{entity.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Establecimiento (CLUES):</span>
                  <p className="font-mono font-bold text-emerald-300">{clues.clues} - {clues.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Preguntas respondidas:</span>
                  <p className="font-bold text-white">
                    {progress.answered} de {progress.total} (100% completado)
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700/60 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowConfirmModal(false);
                    onSubmit();
                  }}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/60 cursor-pointer"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
