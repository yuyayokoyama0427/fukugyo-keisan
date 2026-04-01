import React, { useState } from 'react'

const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12]

const TEMPLATES = [
  { label: 'フリーライター', income: 30, expense: 3 },
  { label: 'デザイナー',     income: 50, expense: 10 },
  { label: 'エンジニア',     income: 100, expense: 5 },
  { label: '動画編集',       income: 40, expense: 15 },
]

export default function InputForm({ values, onChange, hideSideFields = false }) {
  const [validationErrors, setValidationErrors] = useState({})

  const applyTemplate = (template) => {
    setValidationErrors(prev => ({ ...prev, sideIncome: undefined, sideExpense: undefined }))
    onChange({ ...values, sideIncome: template.income, sideExpense: template.expense })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (value === '') {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }))
      onChange({ ...values, [name]: '' })
      return
    }
    const num = Number(value)
    if (isNaN(num)) {
      setValidationErrors(prev => ({ ...prev, [name]: '数値を入力してください' }))
      return
    }
    if (num < 0) {
      setValidationErrors(prev => ({ ...prev, [name]: '0以上の値を入力してください' }))
      return
    }
    setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    onChange({ ...values, [name]: num })
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
          {validationErrors.mainJobIncome && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.mainJobIncome}</p>
          )}
          <div className="flex gap-1.5 mt-2">
            {[300, 500, 700, 1000].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => { setValidationErrors(prev => ({ ...prev, mainJobIncome: undefined })); onChange({ ...values, mainJobIncome: v }) }}
                className="flex-1 text-xs border border-gray-300 rounded-lg py-1 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {v}万
              </button>
            ))}
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

        {/* 業種別テンプレート：Pro版では非表示 */}
        {!hideSideFields && (
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-gray-500 mb-2">業種別テンプレートから入力</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="inline-flex flex-col items-center px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-colors text-left"
                >
                  <span className="text-xs font-bold text-blue-700">{t.label}</span>
                  <span className="text-xs text-blue-500 mt-0.5">収入{t.income}万 / 経費{t.expense}万</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
