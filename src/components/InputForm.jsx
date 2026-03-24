import React from 'react'

const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12]

export default function InputForm({ values, onChange, hideSideFields = false }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...values, [name]: value === '' ? '' : Number(value) })
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-bold text-blue-800 mb-5">収入・経費の入力</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 本業年収 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            本業年収
          </label>
          <div className="relative">
            <input
              type="number"
              name="mainJobIncome"
              value={values.mainJobIncome}
              onChange={handleChange}
              min={0}
              max={100000}
              placeholder="例）500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">税込み・手取りではなく額面で入力</p>
        </div>

        {/* 副業開始月 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            副業開始月
          </label>
          <select
            name="startMonth"
            value={values.startMonth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}月から</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">今年の何月から始める（または始めた）か</p>
        </div>

        {/* 副業収入（月額）：Pro版では非表示 */}
        {!hideSideFields && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              副業収入（月額）
            </label>
            <div className="relative">
              <input
                type="number"
                name="sideIncome"
                value={values.sideIncome}
                onChange={handleChange}
                min={0}
                max={10000}
                placeholder="例）5"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">経費を引く前の収入</p>
          </div>
        )}

        {/* 副業経費（月額）：Pro版では非表示 */}
        {!hideSideFields && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              副業経費（月額）
            </label>
            <div className="relative">
              <input
                type="number"
                name="sideExpense"
                value={values.sideExpense}
                onChange={handleChange}
                min={0}
                max={10000}
                placeholder="例）1"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">万円</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">材料費・交通費・ツール代など</p>
          </div>
        )}
      </div>
    </div>
  )
}
