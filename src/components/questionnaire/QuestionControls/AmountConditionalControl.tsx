import React from 'react';

export interface AmountConditionalValue {
  option: 'Sí' | 'No' | 'No me consta' | '';
  amount?: number | string;
  unknownAmount?: boolean;
}

interface AmountConditionalControlProps {
  questionId: string;
  value: AmountConditionalValue | undefined;
  onChange: (val: AmountConditionalValue) => void;
  onConfirm?: () => void;
  disabled?: boolean;
}

export const AmountConditionalControl: React.FC<AmountConditionalControlProps> = ({
  questionId,
  value = { option: '' },
  onChange,
  onConfirm,
  disabled,
}) => {
  const currentVal: AmountConditionalValue = value || { option: '' };

  const handleOptionChange = (option: 'Sí' | 'No' | 'No me consta') => {
    if (disabled) return;
    if (option === 'Sí') {
      onChange({
        option,
        amount: currentVal.amount !== undefined ? currentVal.amount : '',
        unknownAmount: currentVal.unknownAmount || false,
      });
    } else {
      onChange({
        option,
        amount: undefined,
        unknownAmount: false,
      });
    }
  };

  const handleAmountChange = (amtStr: string) => {
    if (disabled) return;
    onChange({
      ...currentVal,
      option: 'Sí',
      amount: amtStr,
      unknownAmount: false,
    });
  };

  const handleToggleUnknown = (checked: boolean) => {
    if (disabled) return;
    onChange({
      ...currentVal,
      option: 'Sí',
      unknownAmount: checked,
      amount: checked ? '' : currentVal.amount,
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* 3 primary options */}
      <div className="space-y-1.5">
        {(['Sí', 'No', 'No me consta'] as const).map((opt) => {
          const isSelected = currentVal.option === opt;
          return (
            <label
              key={opt}
              className={`flex items-start p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/40'
                  : 'bg-black/30 border-white/10 text-slate-300 hover:border-emerald-600/40'
              }`}
            >
              <input
                type="radio"
                name={questionId}
                value={opt}
                checked={isSelected}
                disabled={disabled}
                onChange={() => handleOptionChange(opt)}
                className="mt-0.5 h-4 w-4 text-emerald-500 border-slate-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer shrink-0"
              />
              <span className="ml-2.5 leading-snug select-none">{opt}</span>
            </label>
          );
        })}
      </div>

      {/* Conditional Amount Sub-Panel if "Sí" */}
      {currentVal.option === 'Sí' && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/40 space-y-3 animate-fadeIn">
          <label className="block text-xs font-semibold text-slate-200">
            ¿De cuánto era aproximadamente al mes? (Rango permitido: $0 a $5,000,000 MXN)
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                $
              </span>
              <input
                type="number"
                min={0}
                max={5000000}
                step={1000}
                disabled={disabled || currentVal.unknownAmount}
                value={currentVal.amount ?? ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onConfirm?.();
                  }
                }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-black/60 border border-white/10 focus:border-emerald-500 text-white font-mono text-sm outline-none disabled:opacity-40"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-slate-900/60 p-2.5 rounded-lg border border-white/10 shrink-0">
              <input
                type="checkbox"
                checked={Boolean(currentVal.unknownAmount)}
                disabled={disabled}
                onChange={(e) => handleToggleUnknown(e.target.checked)}
                className="h-4 w-4 text-emerald-500 rounded border-slate-600 bg-slate-900 cursor-pointer"
              />
              <span className="select-none font-medium text-amber-300">Marcar «No sé»</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
