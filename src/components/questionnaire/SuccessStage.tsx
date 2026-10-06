import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  HardDrive,
  Download,
  RotateCcw,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { SurveySubmission } from '../../types/questionnaire';

interface SuccessStageProps {
  submission: SurveySubmission;
  onReset: () => void;
}

export const SuccessStage: React.FC<SuccessStageProps> = ({
  submission,
  onReset,
}) => {
  const handleDownloadReceipt = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            comprobante: 'Acuse de Envío Oficial de Cuestionario Hospitalario IMSS Bienestar',
            folio: submission.submissionId,
            fechaEnvio: submission.submittedAt,
            entidad: submission.entityName,
            clues: submission.cluesCode,
            establecimiento: submission.hospitalName,
            region: submission.regionName,
            perfil: submission.role,
            preguntasRegistradas: submission.answeredQuestions,
            metodoAlmacenamiento: 'local_backup',
            confirmacionServicio: 'Guardado localmente en este navegador.',
            respuestasPorSeccion: submission.answersBySection,
          },
          null,
          2
        )
      );

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Acuse_${submission.cluesCode}_${submission.submissionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full institutional-glass rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-100 border border-emerald-500/40"
      >
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/40 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cuestionario guardado correctamente
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Gracias por completar el cuestionario. Sus respuestas quedaron guardadas en este navegador.
          </p>
        </div>

        <div className="p-4 rounded-xl mb-6 text-xs flex items-start space-x-3 border bg-black/50 border-white/10 text-slate-200">
          <HardDrive className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">Almacenamiento local</div>
            <p className="leading-relaxed opacity-90">Las respuestas se guardaron en este navegador.</p>
          </div>
        </div>

        {/* Institutional Summary Details */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs mb-8">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Folio de captura:</span>
            </span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              {submission.submissionId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entidad Federativa:</span>
            </span>
            <span className="font-bold text-white">{submission.entityName}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{submission.role === 'director' ? 'Establecimiento (CLUES):' : 'Región:'}</span>
            </span>
            <span className="font-mono font-bold text-white">
              {submission.role === 'director'
                ? `${submission.cluesCode} - ${submission.hospitalName}`
                : submission.regionName}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fecha y hora de envío:</span>
            </span>
            <span className="font-mono text-slate-200">
              {new Date(submission.submittedAt).toLocaleString('es-MX')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preguntas registradas:</span>
            </span>
            <span className="font-bold text-emerald-400">
              {submission.answeredQuestions} de {submission.totalQuestions}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700/60 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Descargar comprobante (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/60"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Capturar nuevo cuestionario</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
