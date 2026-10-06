import React from 'react';
import { QuestionOption } from '../../../types/questionnaire';

interface SingleChoiceControlProps {
  questionId: string;
  options: QuestionOption[];
  value: string | undefined;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const SingleChoiceControl: React.FC<SingleChoiceControlProps> = ({
  questionId,
  options,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const inputId = `${questionId}_${opt.value}`;

        return (
          <label
            key={opt.value}
            htmlFor={inputId}
            className={`flex items-start p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
              isSelected
                ? 'bg-emerald-950/80 border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/40'
                : 'bg-black/30 border-white/10 text-slate-300 hover:border-emerald-600/40 hover:bg-black/50'
            }`}
          >
            <input
              type="radio"
              id={inputId}
              name={questionId}
              value={opt.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 h-4 w-4 text-emerald-500 border-slate-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer shrink-0"
            />
            <span className="ml-2.5 leading-snug select-none">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};
