import React, { useState } from 'react';
import { UserX, Clock, Building2, ChevronRight, Lock, MapPin } from 'lucide-react';
import { UserRole } from '../../types/questionnaire';

interface CoverStageProps {
  onStart: (role: UserRole) => void;
}

export const CoverStage: React.FC<CoverStageProps> = ({ onStart }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center p-4 pt-8 sm:p-6 lg:p-8">
      <div
        className="max-w-3xl w-full cover-stage-panel rounded-2xl p-6 sm:p-10 text-zinc-900"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3 leading-tight">
          Cuestionario para personal directivo hospitalario y de coordinación regional
        </h1>
        <p className="text-base sm:text-lg text-zinc-700 mb-6 font-normal leading-relaxed">
          Evaluación de la situación hospitalaria antes y después del proceso de incorporación al modelo IMSS Bienestar.
        </p>

        <fieldset className="mb-7">
          <legend className="text-sm font-bold text-zinc-800 mb-3">
            Seleccione su perfil para abrir el cuestionario correspondiente
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              { role: 'director', label: 'Director(a) de hospital', Icon: Building2 },
              { role: 'coordinador', label: 'Coordinador(a) regional', Icon: MapPin },
            ] as const).map(({ role, label, Icon }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-900 text-white shadow-md'
                      : 'border-zinc-300 bg-white/70 text-zinc-800 hover:border-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isSelected ? 'text-emerald-200' : 'text-emerald-800'}`} />
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Objective Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.08] border border-white/15 mb-8">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Objetivo del Cuestionario
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Conocer el perfil de los directivos y su valoración del hospital antes y después de la incorporación a <strong className="text-emerald-900">IMSS Bienestar</strong>, para identificar retos operativos prioritarios y presentar el diagnóstico institucional en el auditorio.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Grid (Guaranteed Anonymity) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="p-3.5 rounded-xl bg-zinc-950/[0.04] border border-zinc-300/70 flex items-start space-x-3">
            <UserX className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-zinc-800">100% Anónimo</div>
              <div className="text-[11px] text-zinc-600">Sin registro, sin contraseña ni solicitud de nombre o correo.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/[0.04] border border-zinc-300/70 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-zinc-800">Identificación Institucional</div>
              <div className="text-[11px] text-zinc-600">Solo se asocia a la Entidad y CLUES médica de la unidad.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/[0.04] border border-zinc-300/70 flex items-start space-x-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-zinc-800">9 a 10 Minutos</div>
              <div className="text-[11px] text-zinc-600">Formato ágil de opción múltiple con guardado automático.</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-zinc-300">
          <button
            onClick={() => selectedRole && onStart(selectedRole)}
            disabled={!selectedRole}
            className="w-full sm:flex-1 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 disabled:from-zinc-400 disabled:to-zinc-400 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Comenzar Cuestionario</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
