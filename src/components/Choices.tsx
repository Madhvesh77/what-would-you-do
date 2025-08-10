import React, { useEffect, useCallback } from 'react';
import { Choice } from '../types/story';
import clsx from 'clsx';
import DynamicText from './DynamicText';

export default function Choices({
  choices,
  onChoose
}: {
  choices: Choice[];
  onChoose: (c: Choice) => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const idx = Number(e.key) - 1;
      if (!Number.isNaN(idx) && idx >= 0 && idx < choices.length) {
        onChoose(choices[idx]);
      }
    },
    [choices, onChoose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className="mt-6 grid gap-3 sm:gap-4">
      {choices.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onChoose(c)}
          aria-label={`Choice ${i + 1}: ${c.label}`}
          className={clsx(
            'w-full text-left p-3 sm:p-4 rounded-xl shadow-md border border-gray-700',
            'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100',
            'hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.02]',
            'transform transition-transform duration-200 active:scale-95 focus:outline-none'
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-gray-400">{`Option ${i + 1}`}</div>
              <div className="font-medium mt-0.5 sm:mt-1 text-sm sm:text-base">
                <DynamicText text={c.label} animation={c.animation} />
              </div>
            </div>
            {c.tags && (
              <div className="text-[0.65rem] sm:text-xs text-gray-500">
                {c.tags.join(', ')}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
