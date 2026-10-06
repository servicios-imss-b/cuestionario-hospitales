import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { QuestionOption } from '../../../types/questionnaire';

interface MultipleChoiceControlProps {
  questionId: string;
  options: QuestionOption[];
  value: string[] | undefined;
  maxSelections?: number;
  exactSelectionCount?: number;
  requiresConfirmation?: boolean;
  isConfirmed?: boolean;
  onConfirm?: (confirmed: boolean) => void;
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

export const MultipleChoiceControl: React.FC<MultipleChoiceControlProps> = ({
  questionId,
  options,
  value = [],
  maxSelections,
  exactSelectionCount,
  requiresConfirmation = false,
  isConfirmed = false,
  onConfirm,
  onChange,
  disabled,
}) => {
  const currentValues = Array.isArray(value) ? value : [];
  const selectionCount = currentValues.filter((selectedValue) =>
    !options.find((option) => option.value === selectedValue)?.exclusive
  ).length;
  const hasExclusiveSelection = currentValues.some((selectedValue) =>
    options.find((option) => option.value === selectedValue)?.exclusive
  );
  const canConfirm = currentValues.length > 0 && (
    hasExclusiveSelection ||
    exactSelectionCount === undefined ||
    selectionCount === exactSelectionCount
  );

  const handleToggle = (opt: QuestionOption) => {
    if (disabled) return;

    if (opt.exclusive) {
      // If clicking an exclusive option, it becomes the sole selection (or toggles off)
      if (currentValues.includes(opt.value)) {
        onChange([]);
      } else {
        onChange([opt.value]);
      }
    } else {
      // Non-exclusive option: remove any exclusive options first
      const nonExclusiveExisting = currentValues.filter((v) => {
        const matchingOpt = options.find((o) => o.value === v);
        return !matchingOpt?.exclusive;
      });

      if (nonExclusiveExisting.includes(opt.value)) {
        onChange(nonExclusiveExisting.filter((v) => v !== opt.value));
      } else if (maxSelections !== undefined && nonExclusiveExisting.length >= maxSelections) {
        return;
      } else {
        onChange([...nonExclusiveExisting, opt.value]);
      }
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {options.map((opt) => {
        const isChecked = currentValues.includes(opt.value);
        const inputId = `${questionId}_${opt.value}`;

        return (
          <label
            key={opt.value}
            htmlFor={inputId}
            className={`flex items-start p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
              isChecked
                ? 'bg-emerald-950/80 border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/40'
                : 'bg-black/30 border-white/10 text-slate-300 hover:border-emerald-600/40 hover:bg-black/50'
            }`}
          >
            <input
              type="checkbox"
              id={inputId}
              checked={isChecked}
              disabled={disabled || (
                !opt.exclusive &&
                !isChecked &&
                maxSelections !== undefined &&
                selectionCount >= maxSelections
              )}
              onChange={() => handleToggle(opt)}
              className="mt-0.5 h-4 w-4 text-emerald-500 rounded border-slate-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer shrink-0"
            />
            <span className="ml-2.5 leading-snug select-none flex-1">
              {opt.label}
              {opt.exclusive && (
                <span className="ml-1.5 text-[10px] text-amber-300/80 uppercase font-medium">
                  (Opción única)
                </span>
              )}
            </span>
          </label>
        );
      })}
      {maxSelections !== undefined && (
        <p className="text-[11px] text-slate-400">
          Seleccionadas: {selectionCount} de {exactSelectionCount ?? maxSelections} {exactSelectionCount ? 'requeridas' : 'máximo'}.
        </p>
      )}
      {requiresConfirmation && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-400">
            {isConfirmed ? 'Selección confirmada.' : 'Confirme la selección para continuar.'}
          </span>
          <button
            type="button"
            disabled={!isConfirmed && !canConfirm}
            onClick={() => onConfirm?.(!isConfirmed)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              isConfirmed
                ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-200'
                : canConfirm
                  ? 'border-emerald-500 bg-emerald-700 text-white hover:bg-emerald-600'
                  : 'border-white/10 bg-black/20 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isConfirmed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {isConfirmed ? 'Editar selección' : 'Confirmar selección'}
          </button>
        </div>
      )}
    </div>
  );
};
