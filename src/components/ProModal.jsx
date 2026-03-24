import React, { useState, useEffect } from 'react'

const CHECKOUT_URL = 'https://yomiyasu.lemonsqueezy.com/checkout/buy/5aaab70d-d49a-4d97-b473-17963c500c6e'

export default function ProModal({ isOpen, onClose, onActivate, isLoading, error, setError }) {
  const [inputKey, setInputKey] = useState('')

  useEffect(() => {
    if (isOpen) {
      setInputKey('')
      setError('')
    }
  }, [isOpen, setError])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = inputKey.trim()
    if (!trimmed) return
    const success = await onActivate(trimmed)
    if (success) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-blue-900">Pro版にアップグレード</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="閉じる"
            >
              &times;
            </button>
          </div>
          <p className="text-sm text-gray-500">複数副業の合算・CSVエクスポート・節税アドバイスが使えます</p>
        </div>

        {/* Pro機能一覧 */}
        <div className="px-6 py-4 bg-blue-50">
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">&#10003;</span>
              複数副業（最大5件）の合算計算
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">&#10003;</span>
              年間収支データのCSVエクスポート
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">&#10003;</span>
              あなたの状況に応じた節税アドバイス
            </li>
          </ul>
        </div>

        <div className="p-6 space-y-5">
          {/* 購入リンク */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">まだ購入していない方はこちら</p>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Pro版を購入する
            </a>
            <p className="text-xs text-gray-400 mt-2">購入後にライセンスキーがメールで届きます</p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">すでに購入済みの方</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="ライセンスキーを入力"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading || !inputKey.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {isLoading ? '認証中...' : '認証する'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
