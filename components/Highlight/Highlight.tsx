import React from 'react';

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray-900 p-1 text-yellow-500 shadow rounded">
      {children}
    </span>
  );
}
