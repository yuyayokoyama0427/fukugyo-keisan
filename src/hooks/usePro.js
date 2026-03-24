import { useState, useEffect, useCallback } from 'react'

const LICENSE_KEY_STORAGE = 'fukugyo_license_key'
const IS_PRO_STORAGE = 'fukugyo_is_pro'

export function usePro() {
  const [isPro, setIsPro] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // アプリ起動時にlocalStorageからPro状態を復元
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(LICENSE_KEY_STORAGE)
      const savedIsPro = localStorage.getItem(IS_PRO_STORAGE)
      if (savedKey && savedIsPro === 'true') {
        setLicenseKey(savedKey)
        setIsPro(true)
      }
    } catch (_) {}
  }, [])

  // ライセンスキーを認証する
  const activate = useCallback(async (key) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key }),
      })
      const data = await res.json()
      if (data.valid) {
        setIsPro(true)
        setLicenseKey(key)
        localStorage.setItem(LICENSE_KEY_STORAGE, key)
        localStorage.setItem(IS_PRO_STORAGE, 'true')
        return true
      } else {
        setError('ライセンスキーが無効です。購入後に届いたメールをご確認ください。')
        return false
      }
    } catch (_) {
      setError('通信エラーが発生しました。しばらく経ってから再試行してください。')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isPro, licenseKey, isLoading, error, activate, setError }
}
