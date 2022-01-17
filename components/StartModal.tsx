import * as React from 'react';


export function StartModal({visible, handleInit} : {visible: boolean, handleInit: () => void}){

  if (!visible){
    return null;
  }

  return (
    <section className="fixed top-0 left-0 w-full h-screen bg-transparent flex items-center justify-center">
      <div className="w-9/12 h-4/6 bg-white flex items-center justify-center shadow-lg">
        <button className="border border-current text-xl py-2 px-4 rounded" onClick={handleInit}>Start</button>
      </div>

    </section>
  )
}