import React from 'react';
import { MatrixItem } from '../../../types/questionnaire';

interface NumberMatrixControlProps {
  questionId: string;
  items: MatrixItem[];
  value: Record<string, number | string> | undefined;
  onChange: (value: Record<string, number | string>) => void;
  disabled?: boolean;
}

export const NumberMatrixControl: React.FC<NumberMatrixControlProps> = ({
  questionId,
  items,
  value = {},
  onChange,
  disabled,
}) => (
  <div className="space-y-2">
    {items.map((item) => (
      <label key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_8rem] items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
        <span className="text-sm text-slate-200">{item.label}</span>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          aria-label={`${item.label}: número de personas`}
          value={value[item.id] ?? ''}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, [item.id]: event.target.value })}
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          id={`${questionId}_${item.id}`}
        />
      </label>
    ))}
  </div>
);