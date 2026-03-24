import React, { useState, useEffect } from 'react'
import InputForm from './components/InputForm'
import ResultDashboard from './components/ResultDashboard'
import { calculate } from './utils/taxCalculator'

const STORAGE_KEY = 'fukugyo-keisan-inputs'

const DEFAULT_VALUES = {
  mainJobIncome: '',
  sideIncome: '',
  sideExpense: '',
  startMonth: 1,
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_VALUES, ...JSON.parse(saved) }
  } catch (_) {}
  return DEFAULT_VALUES
}

export default function App() {
  const [inputs, setInputs] = useState(loadFromStorage)
  const [result, setResult] = useState(null)

  // 入力変更時に localStorage に保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
    } catch (_) {}
  }, [inputs])

  // 入力が揃っていれば自動計算
  useEffect(() => {
    const { mainJobIncome, sideIncome, sideExpense, startMonth } = inputs
    if (
      mainJobIncome !== '' && mainJobIncome >= 0 &&
      sideIncome !== '' && sideIncome >= 0 &&
      sideExpense !== '' && sideExpense >= 0 &&
      startMonth >= 1 && startMonth <= 12
    ) {
      setResult(calculate(inputs))
    } else {
      setResult(null)
    }
  }, [inputs])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg select-none">
            副
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-900 leading-tight">副業ぜんぶ計算くん</h1>
            <p className="text-xs text-gray-400">手取り・税金・確定申告・会社バレをまとめて確認</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 入力フォーム */}
        <InputForm values={inputs} onChange={setInputs} />

        {/* 計算結果 */}
        {result ? (
          <ResultDashboard result={result} />
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-base">数値を入力すると結果がここに表示されます</p>
          </div>
        )}

        {/* 免責表示 */}
        <p className="text-center text-xs text-gray-400 pb-6">
          ※ 表示される金額はすべて参考値です。実際の税額とは異なる場合があります。詳細は税理士・税務署にご確認ください。
        </p>
      </main>
    </div>
  )
}
