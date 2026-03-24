import React from 'react'

export default function ProGate({ onUpgrade }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-dashed border-gray-200">
      <div className="flex flex-col items-center text-center py-4 space-y-3">
        <span className="text-3xl">&#128274;</span>
        <p className="text-sm font-medium text-gray-600">Pro版で使えます</p>
        <button
          onClick={onUpgrade}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
        >
          Pro版へアップグレード
        </button>
      </div>
    </div>
  )
}
