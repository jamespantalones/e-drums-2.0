import React from 'react';

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className=" p-1 text-right px-2 select-none text-black border-2 border-black first-line:inline-block uppercase"
      style={{ minWidth: '40px' }}
    >
      {children}
    </span>
  );
}
