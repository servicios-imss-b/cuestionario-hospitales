import React, { useMemo } from 'react';
import { MatrixItem, QuestionOption } from '../../../types/questionnaire';

interface MatrixControlProps {
  questionId: string;
  items: MatrixItem[];
  columns: QuestionOption[];
  value: Record<string, string> | undefined;
  onChange: (val: Record<string, string>) => void;
  disabled?: boolean;
}

export const MatrixControl: React.FC<MatrixControlProps> = ({
  questionId,
  items,
  columns,
  value = {},
  onChange,
  disabled,
}) => {
  const currentMap = value || {};
  const randomizedItems = useMemo(() => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }, [items]);

  const handleSelect = (itemId: string, colValue: string) => {
    if (disabled) return;
    onChange({
      ...currentMap,
      [itemId]: colValue,
    });
  };

  const answeredCount = randomizedItems.filter((item) => Boolean(currentMap[item.id])).length;
  const isComplete = answeredCount === randomizedItems.length;

  return (
    <div className="w-full space-y-3">
      {/* Mini indicator */}
      <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-white/10">
        <span>Evaluación de aspectos ({answeredCount} de {randomizedItems.length} calificados):</span>
        <span className={`font-semibold ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isComplete ? 'Completo' : `${randomizedItems.length - answeredCount} pendientes`}
        </span>
      </div>

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10 bg-black/30">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#002f2a]/90 text-slate-200 border-b border-emerald-900/60 sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3 font-semibold text-slate-100">Aspecto Evaluado</th>
              {columns.map((col) => (
                <th key={col.value} className="py-2.5 px-3 text-center font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {randomizedItems.map((item, idx) => {
              const selectedCol = currentMap[item.id];
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-950/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-black/10' : 'bg-white/[0.02]'
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-slate-200 leading-snug">
                    {item.label}
                  </td>
                  {columns.map((col) => {
                    const isChecked = selectedCol === col.value;
                    const cellId = `${questionId}_${item.id}_${col.value}`;
                    return (
                      <td key={col.value} className="py-2.5 px-3 text-center">
                        <label
                          htmlFor={cellId}
                          className="inline-flex items-center justify-center p-1.5 cursor-pointer rounded-lg hover:bg-emerald-500/20"
                        >
                          <input
                            type="radio"
                            id={cellId}
                            name={`${questionId}_${item.id}`}
                            value={col.value}
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() => handleSelect(item.id, col.value)}
                            className="h-4 w-4 text-emerald-500 border-slate-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card / Segment View - No horizontal scroll! */}
      <div className="md:hidden space-y-2.5">
        {randomizedItems.map((item) => {
          const selectedCol = currentMap[item.id];
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                selectedCol
                  ? 'bg-black/40 border-emerald-500/40'
                  : 'bg-black/20 border-white/10'
              }`}
            >
              <div className="text-xs font-medium text-slate-200 mb-2 leading-snug">
                {item.label}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {columns.map((col) => {
                  const isChecked = selectedCol === col.value;
                  return (
                    <button
                      key={col.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelect(item.id, col.value)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-emerald-700 text-white border-emerald-400 font-bold shadow-sm'
                          : 'bg-black/30 border-white/10 text-slate-300 hover:bg-emerald-950/50'
                      }`}
                    >
                      {col.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
