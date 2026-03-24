import React from 'react'

const MAX_JOBS = 20

const DEFAULT_JOB = { name: '', income: '', expense: '' }

export default function SideJobList({ jobs, onChange }) {
  const handleJobChange = (index, field, value) => {
    const updated = jobs.map((job, i) =>
      i === index
        ? { ...job, [field]: value === '' ? '' : field === 'name' ? value : Number(value) }
        : job
    )
    onChange(updated)
  }

  const handleAdd = () => {
    if (jobs.length >= MAX_JOBS) return
    onChange([...jobs, { ...DEFAULT_JOB }])
  }

  const handleRemove = (index) => {
    if (jobs.length <= 1) return
    onChange(jobs.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-blue-800">副業の入力（複数対応）</h2>
        <span className="text-xs text-gray-400">{jobs.length}件</span>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">副業 {index + 1}</span>
              {jobs.length > 1 && (
                <button
                  onClick={() => handleRemove(index)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  削除
                </button>
              )}
            </div>

            {/* 副業名 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">副業名（任意）</label>
              <input
                type="text"
                value={job.name}
                onChange={(e) => handleJobChange(index, 'name', e.target.value)}
                placeholder="例）Webライター、デザイン"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 月収 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">月収</label>
                <div className="relative">
                  <input
                    type="number"
                    value={job.income}
                    onChange={(e) => handleJobChange(index, 'income', e.target.value)}
                    min={0}
                    step="0.1"
                    placeholder="例）5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">万円</span>
                </div>
              </div>

              {/* 月間経費 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">月間経費</label>
                <div className="relative">
                  <input
                    type="number"
                    value={job.expense}
                    onChange={(e) => handleJobChange(index, 'expense', e.target.value)}
                    min={0}
                    step="0.1"
                    placeholder="例）1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">万円</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length < MAX_JOBS && (
        <button
          onClick={handleAdd}
          className="mt-4 w-full border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-500 hover:text-blue-700 rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          + 副業を追加
        </button>
      )}
    </div>
  )
}
