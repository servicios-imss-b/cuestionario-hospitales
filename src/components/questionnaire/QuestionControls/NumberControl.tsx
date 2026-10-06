import React from 'react';

interface NumberControlProps {
  questionId: string;
  value: number | string | undefined;
  min?: number;
  max?: number;
  onChange: (val: number | string) => void;
  disabled?: boolean;
}

export const NumberControl: React.FC<NumberControlProps> = ({
  questionId,
  value = '',
  min = 25,
  max = 80,
  onChange,
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
          value={value ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Entre ${min} y ${max} años`}
          className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-emerald-500 text-white font-mono text-sm outline-none transition-colors"
        />
      </div>
      <div className="text-[11px] text-slate-400">
        Rango de validación oficial: {min} a {max} años de edad.
      </div>
    </div>
  );
};
