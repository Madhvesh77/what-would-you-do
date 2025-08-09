import React from 'react';
import { Node } from '../types/story';
import clsx from 'clsx';

export default function SceneCard({ node }: { node: Node }) {
  if (!node) return null;

  return (
    <div
      className={clsx(
        'max-w-3xl mx-auto p-8 rounded-2xl shadow-lg bg-gray-900 text-gray-100',
        'transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
      )}
    >
      {node.title && (
        <h2 className="text-2xl font-bold mb-4">{node.title}</h2>
      )}
      <div className="space-y-4">
        {node.content.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
