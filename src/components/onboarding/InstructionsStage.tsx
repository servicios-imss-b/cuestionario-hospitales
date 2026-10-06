import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  Search,
  ListFilter,
  Save,
  HelpCircle,
} from 'lucide-react';

interface InstructionsStageProps {
  onContinue: () => void;
  onBack: () => void;
}

export const InstructionsStage: React.FC<InstructionsStageProps> = ({
  onContinue,
  onBack,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl w-full institutional-glass rounded-2xl p-6 sm:p-9 shadow-2xl text-slate-100"
      >
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Guía de llenado institucional</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Instrucciones para el diligenciamiento
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
          Por favor revise las siguientes pautas antes de iniciar la captura de respuestas de su hospital o región:
        </p>

        {/* Steps and Guidelines */}
        <div className="space-y-4 mb-8">
          {/* Card 1: Entidad y CLUES */}
          <div className="p-4 rounded-xl bg-white/[0.08] border border-white/15 flex items-start space-x-3.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                1. Selección de Entidad y CLUES (Sin cuentas ni login)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El formulario no solicita usuario, correo ni contraseña. Su respuesta se identificará exclusivamente con su <strong>Entidad Federativa</strong> y la <strong>CLUES</strong> del establecimiento hospitalario (o región operativa). Escriba en los buscadores para localizar su entidad y unidad con rapidez.
              </p>
            </div>
          </div>

          {/* Card 2: Estados visuales */}
          <div className="p-4 rounded-xl bg-white/[0.08] border border-white/15">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <ListFilter className="w-4 h-4 text-emerald-400" />
              <span>2. Estados visuales de las preguntas</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Cada pregunta cuenta con indicadores claros de avance y validación:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/30 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold text-amber-300">Pendiente:</span>
                  <p className="text-[11px] text-slate-400">Pregunta por responder.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/30 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-300">Respondida:</span>
                  <p className="text-[11px] text-slate-400">Respuesta registrada válida.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/30 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="font-semibold text-rose-300">Con Error:</span>
                  <p className="text-[11px] text-slate-400">Formato o rango incorrecto.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Dinámica de llenado y periodos */}
          <div className="p-4 rounded-xl bg-white/[0.08] border border-white/15 flex items-start space-x-3.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                3. Periodo de referencia y respuestas balanceadas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Las preguntas de comparación solicitan contrastar la situación actual con el <strong>año previo a la incorporación a IMSS Bienestar</strong>. Todas las escalas son balanceadas e incluyen la opción <em>«No me consta»</em> para no forzar opiniones sobre periodos que usted no vivió en el hospital.
              </p>
            </div>
          </div>

          {/* Card 4: Guardado automático */}
          <div className="p-4 rounded-xl bg-white/[0.08] border border-white/15 flex items-start space-x-3.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                4. Guardado automático y resumen final
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Su progreso se guarda automáticamente. Las preguntas respondidas desaparecen de la captura y al terminar podrá revisar el detalle de sus respuestas.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700/50 transition-colors cursor-pointer"
          >
            Regresar
          </button>

          <button
            onClick={onContinue}
            className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>Continuar a Selección Institucional</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
