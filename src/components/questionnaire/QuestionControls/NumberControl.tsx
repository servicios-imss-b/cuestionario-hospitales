import React from 'react';

interface NumberControlProps {
  questionId: string;
  value: number | string | undefined;
  min?: number;
  max?: number;
  unknownLabel?: string;
  onChange: (val: number | string) => void;
  onConfirm?: () => void;
  disabled?: boolean;
}

export const NumberControl: React.FC<NumberControlProps> = ({
  questionId,
  value = '',
  min,
  max,
  unknownLabel,
  onChange,
  onConfirm,
  disabled,
}) => {
  return (
    <div className="w-full max-w-xs space-y-1">
      <div className="relative">
        <input
          type="number"
          id={questionId}
          name={questionId}
          min={min}
          max={max}
          step={1}
          value={value === 'unknown' ? '' : value ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onConfirm?.();
            }
          }}
          placeholder={min !== undefined && max !== undefined ? `Entre ${min} y ${max}` : 'Ingrese un número'}
          className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-emerald-500 text-white font-mono text-sm outline-none transition-colors"
        />
      </div>
      {min !== undefined && max !== undefined && (
        <div className="text-[11px] text-slate-400">Rango permitido: {min} a {max}.</div>
      )}
      {unknownLabel && (
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={value === 'unknown'}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked ? 'unknown' : '')}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500"
          />
          {unknownLabel}
        </label>
      )}
    </div>
  );
};
