import React from 'react';

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-neutral-900 p-1 text-right px-2 select-none text-yellow-500 rounded inline-block"
      style={{ minWidth: '40px' }}
    >
      {children}
    </span>
  );
}
