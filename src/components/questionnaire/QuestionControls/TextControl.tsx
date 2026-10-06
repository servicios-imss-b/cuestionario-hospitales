import React from 'react';

interface TextControlProps {
  questionId: string;
  isLong?: boolean;
  value: string | undefined;
  maxLength?: number;
  placeholder?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const TextControl: React.FC<TextControlProps> = ({
  questionId,
  isLong = false,
  value = '',
  maxLength = 300,
  placeholder,
  onChange,
  disabled,
}) => {
  const currentLength = (value || '').length;
  const isOverLimit = currentLength > maxLength;

  return (
    <div className="w-full space-y-1">
      {isLong ? (
        <textarea
          id={questionId}
          name={questionId}
          rows={3}
          maxLength={maxLength + 50}
          value={value ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Escriba su respuesta (máximo ${maxLength} caracteres)...`}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-emerald-500 text-white text-xs sm:text-sm outline-none transition-colors resize-y leading-relaxed"
        />
      ) : (
        <input
          type="text"
          id={questionId}
          name={questionId}
          maxLength={maxLength}
          value={value ?? ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Escriba aquí...'}
          className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-emerald-500 text-white text-xs sm:text-sm outline-none transition-colors"
        />
      )}

      {maxLength && (
        <div className="flex justify-end">
          <span
            className={`text-[11px] font-mono ${
              isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-400'
            }`}
          >
            {currentLength} / {maxLength} caracteres
          </span>
        </div>
      )}
    </div>
  );
};
