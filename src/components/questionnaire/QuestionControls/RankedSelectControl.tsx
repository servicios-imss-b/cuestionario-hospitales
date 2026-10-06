import React from 'react';
import { QuestionOption } from '../../../types/questionnaire';
import { ArrowUp, ArrowDown, X, Check, Award } from 'lucide-react';

interface RankedSelectControlProps {
  questionId: string;
  options: QuestionOption[];
  value: string[] | undefined; // Array of 3 option values in priority order [1st, 2nd, 3rd]
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

export const RankedSelectControl: React.FC<RankedSelectControlProps> = ({
  options,
  value = [],
  onChange,
  disabled,
}) => {
  const currentRanked = Array.isArray(value) ? value : [];

  const handleSelectOption = (optValue: string) => {
    if (disabled) return;
    if (currentRanked.includes(optValue)) {
      // Remove if already chosen
      onChange(currentRanked.filter((v) => v !== optValue));
    } else {
      // If we already have 3, don't add more
      if (currentRanked.length >= 3) return;
      onChange([...currentRanked, optValue]);
    }
  };

  const handleRemoveRank = (idx: number) => {
    if (disabled) return;
    const updated = [...currentRanked];
    updated.splice(idx, 1);
    onChange(updated);
  };

  const handleMoveUp = (idx: number) => {
    if (disabled || idx === 0) return;
    const updated = [...currentRanked];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (disabled || idx === currentRanked.length - 1) return;
    const updated = [...currentRanked];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onChange(updated);
  };

  const rankLabels = ['1° Más importante (Prioridad máxima)', '2° Segundo más importante', '3° Tercer más importante'];
  const rankColors = [
    'border-amber-500/60 bg-amber-950/20 text-amber-300',
    'border-slate-400/50 bg-slate-900/40 text-slate-200',
    'border-amber-700/50 bg-amber-950/10 text-amber-200',
  ];

  return (
    <div className="w-full space-y-4">
      {/* 3 Ranked Slots */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/40 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
          <span className="font-semibold text-emerald-300 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Priorización de 3 problemas principales:</span>
          </span>
          <span className={currentRanked.length === 3 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
            {currentRanked.length} de 3 seleccionados
          </span>
        </div>

        {[0, 1, 2].map((slotIndex) => {
          const assignedVal = currentRanked[slotIndex];
          const assignedOpt = options.find((o) => o.value === assignedVal);

          return (
            <div
              key={slotIndex}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                assignedOpt
                  ? rankColors[slotIndex]
                  : 'border-dashed border-slate-700 bg-black/20 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-xs font-bold shrink-0">
                  {slotIndex + 1}°
                </span>
                <div className="truncate">
                  <div className="text-[11px] font-medium opacity-80">{rankLabels[slotIndex]}</div>
                  <div className="text-xs sm:text-sm font-semibold truncate text-white">
                    {assignedOpt ? assignedOpt.label : 'Sin asignar (elija una opción del listado inferior)'}
                  </div>
                </div>
              </div>

              {assignedOpt && !disabled && (
                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    type="button"
                    disabled={slotIndex === 0}
                    onClick={() => handleMoveUp(slotIndex)}
                    title="Subir de prioridad"
                    className="p-1 rounded bg-black/40 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={slotIndex === currentRanked.length - 1}
                    onClick={() => handleMoveDown(slotIndex)}
                    title="Bajar de prioridad"
                    className="p-1 rounded bg-black/40 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveRank(slotIndex)}
                    title="Quitar"
                    className="p-1 rounded bg-rose-950/60 text-rose-300 hover:text-rose-100 hover:bg-rose-900 border border-rose-800/40 cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available options list */}
      <div>
        <div className="text-xs text-slate-300 mb-2 font-medium">
          Haga clic sobre un aspecto para asignarlo a la siguiente posición:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
          {options.map((opt) => {
            const rankIndex = currentRanked.indexOf(opt.value);
            const isRanked = rankIndex !== -1;

            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled || (!isRanked && currentRanked.length >= 3)}
                onClick={() => handleSelectOption(opt.value)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start justify-between cursor-pointer ${
                  isRanked
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : currentRanked.length >= 3
                    ? 'opacity-40 bg-black/20 border-white/5 text-slate-400 cursor-not-allowed'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-emerald-500/50 hover:bg-black/50'
                }`}
              >
                <span className="leading-snug">{opt.label}</span>
                {isRanked ? (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shrink-0">
                    {rankIndex + 1}° lugar
                  </span>
                ) : (
                  <span className="ml-2 text-slate-500 shrink-0 font-bold text-xs">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
