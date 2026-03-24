import React, { useState, useEffect } from 'react'
import InputForm from './components/InputForm'
import ResultDashboard from './components/ResultDashboard'
import SideJobList from './components/SideJobList'
import TaxAdvice from './components/TaxAdvice'
import ProGate from './components/ProGate'
import ProModal from './components/ProModal'
import { usePro } from './hooks/usePro'
import { calculate, exportMonthlyCSV } from './utils/taxCalculator'

const STORAGE_KEY = 'fukugyo-keisan-inputs'
const SIDE_JOBS_KEY = 'fukugyo-keisan-sidejobs'

const DEFAULT_VALUES = {
  mainJobIncome: '',
  sideIncome: '',
  sideExpense: '',
  startMonth: 1,
}

const DEFAULT_SIDE_JOBS = [{ name: '', income: '', expense: '' }]

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_VALUES, ...JSON.parse(saved) }
  } catch (_) {}
  return DEFAULT_VALUES
}

function loadSideJobsFromStorage() {
  try {
    const saved = localStorage.getItem(SIDE_JOBS_KEY)
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return DEFAULT_SIDE_JOBS
}

export default function App() {
  const [inputs, setInputs] = useState(loadFromStorage)
  const [sideJobs, setSideJobs] = useState(loadSideJobsFromStorage)
  const [result, setResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { isPro, isLoading, error, activate, setError } = usePro()

  // 入力変更時にlocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
    } catch (_) {}
  }, [inputs])

  // 複数副業変更時にlocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(SIDE_JOBS_KEY, JSON.stringify(sideJobs))
    } catch (_) {}
  }, [sideJobs])

  // 入力が揃っていれば自動計算
  useEffect(() => {
    const { mainJobIncome, sideIncome, sideExpense, startMonth } = inputs

    if (
      mainJobIncome !== '' && mainJobIncome >= 0 &&
      startMonth >= 1 && startMonth <= 12
    ) {
      if (isPro) {
        // Pro版：複数副業モード（少なくとも1件に収入があれば計算）
        const hasAnyIncome = sideJobs.some(j => j.income !== '' && Number(j.income) >= 0)
        if (hasAnyIncome) {
          setResult(calculate({ mainJobIncome, startMonth, sideJobs }))
        } else {
          setResult(null)
        }
      } else {
        // 無料版：単一副業モード
        if (
          sideIncome !== '' && sideIncome >= 0 &&
          sideExpense !== '' && sideExpense >= 0
        ) {
          setResult(calculate({ mainJobIncome, sideIncome, sideExpense, startMonth }))
        } else {
          setResult(null)
        }
      }
    } else {
      setResult(null)
    }
  }, [inputs, sideJobs, isPro])

  const handleExportCSV = () => {
    if (result) exportMonthlyCSV(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg select-none">
              副
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-900 leading-tight">副業ぜんぶ計算くん</h1>
              <p className="text-xs text-gray-400">手取り・税金・確定申告・会社バレをまとめて確認</p>
            </div>
          </div>

          {/* Proバッジ or アップグレードボタン */}
          {isPro ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Pro版
            </span>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>&#128274;</span>
              Pro版へ
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 基本入力フォーム */}
        <InputForm values={inputs} onChange={setInputs} hideSideFields={isPro} />

        {/* Pro機能A：複数副業 */}
        {isPro ? (
          <SideJobList jobs={sideJobs} onChange={setSideJobs} />
        ) : (
          <ProGate onUpgrade={() => setIsModalOpen(true)} />
        )}

        {/* 計算結果 */}
        {result ? (
          <ResultDashboard result={result} />
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">&#128202;</p>
            <p className="text-base">数値を入力すると結果がここに表示されます</p>
          </div>
        )}

        {/* Pro機能C：節税アドバイス */}
        {isPro && result ? (
          <TaxAdvice result={result} />
        ) : isPro ? null : (
          <ProGate onUpgrade={() => setIsModalOpen(true)} />
        )}

        {/* Pro機能B：CSVエクスポート */}
        {isPro && result && (
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-800">年間収支データ</p>
                <p className="text-xs text-gray-400 mt-0.5">月次データをCSVでダウンロードできます</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                CSVダウンロード
              </button>
            </div>
          </div>
        )}

        {/* 免責表示 */}
        <p className="text-center text-xs text-gray-400 pb-6">
          ※ 表示される金額はすべて参考値です。実際の税額とは異なる場合があります。詳細は税理士・税務署にご確認ください。
        </p>
      </main>

      {/* Proアップグレードモーダル */}
      <ProModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onActivate={activate}
        isLoading={isLoading}
        error={error}
        setError={setError}
      />
    </div>
  )
}
