import React from 'react';

export default function ReconsiderButton({ onReconsider }: { onReconsider: () => void }) {
  return (
    <button
      onClick={onReconsider}
      className="fixed top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full shadow-lg z-50 transition-transform hover:scale-105"
    >
      Reconsider
    </button>
  );
}