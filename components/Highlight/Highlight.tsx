import React from 'react';

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray-900 p-1 px-2 select-none text-yellow-500 shadow rounded inline-block">
      {children}
    </span>
  );
}
