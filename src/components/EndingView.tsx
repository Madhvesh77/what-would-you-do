import React from 'react';
import { Ending } from '../types/story';

export default function EndingView({ ending, archetypeName, onReplay }: { ending: Ending; archetypeName: string; onReplay: () => void }) {
  return (
    <div className="max-w-3xl mx-auto p-8 rounded-xl shadow-lg bg-white/95">
      <h2 className="text-2xl font-semibold mb-4">{ending.title}</h2>
      <div className="space-y-4 mb-6">
        {ending.text.map((t, i) => (
          <p key={i} className="leading-relaxed">{t}</p>
        ))}
      </div>
      <div className="p-4 rounded border bg-gray-50 mb-6">
        <div className="text-sm text-gray-500">Archetype</div>
        <div className="font-semibold">{archetypeName}</div>
        <p className="mt-2 text-gray-700">{ending.reflection}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onReplay} className="px-4 py-2 rounded bg-blue-600 text-white">Replay</button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
            } catch (e) {
              // noop
            }
          }}
          className="px-4 py-2 rounded border"
        >
          Share
        </button>
      </div>
    </div>
  );
}
