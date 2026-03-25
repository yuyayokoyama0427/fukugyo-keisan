import React from 'react'
import AnnualChart from './AnnualChart'

function formatYen(amount) {
  if (amount >= 10000) {
    return `${Math.round(amount / 10000).toLocaleString()}万円`
  }
  return `${Math.round(amount).toLocaleString()}円`
}

function TaxReturnBadge({ needed }) {
  if (needed) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-700">
        必要
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
      不要（※）
    </span>
  )
}

function BaleRiskBadge({ level }) {
  const config = {
    low: { label: 'リスク低', cls: 'bg-green-100 text-green-700' },
    medium: { label: 'リスク中', cls: 'bg-yellow-100 text-yellow-700' },
    high: { label: 'リスク高', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = config[level]
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${cls}`}>
      {label}
    </span>
  )
}

function StatCard({ title, value, sub, accent }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${accent}`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

export default function ResultDashboard({ result }) {
  if (!result) return null

  const {
    annualSideNetIncome,
    incomeTaxIncrease,
    residentTaxIncrease,
    totalTaxIncrease,
    takeHomeIncrease,
    needsTaxReturn,
    baleRisk,
    furusatoLimit,
    monthlyData,
    activeMonths,
  } = result

  return (
    <div className="space-y-5">
      {/* 会社バレ警告バナー */}
      {baleRisk !== 'low' && (
        <div className={`rounded-2xl p-4 flex items-start gap-3 ${baleRisk === 'high' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <span className="text-xl mt-0.5">{baleRisk === 'high' ? '⚠️' : '💡'}</span>
          <div>
            <p className={`text-sm font-bold mb-1 ${baleRisk === 'high' ? 'text-red-700' : 'text-yellow-700'}`}>
              {baleRisk === 'high' ? '会社バレリスク：高' : '会社バレリスク：中'}
            </p>
            <p className={`text-xs ${baleRisk === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
              {baleRisk === 'high'
                ? '確定申告時に住民税の徴収方法を「普通徴収（自分で納付）」に設定してください。設定しないと会社の給与に上乗せされバレる可能性があります。'
                : '住民税の申告を行う場合は「普通徴収」を選択しましょう。'}
            </p>
          </div>
        </div>
      )}

      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="手取り増加額（年間）"
          value={formatYen(takeHomeIncrease)}
          sub={`副業所得 ${formatYen(annualSideNetIncome)} から税金を引いた額`}
          accent="border-blue-500"
        />
        <StatCard
          title="税金増加額（年間）"
          value={formatYen(totalTaxIncrease)}
          sub={`所得税 ${formatYen(incomeTaxIncrease)} ＋ 住民税 ${formatYen(residentTaxIncrease)}`}
          accent="border-red-400"
        />
      </div>

      {/* 確定申告・会社バレ */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">確定申告・会社バレチェック</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 確定申告 */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">確定申告の要否</p>
            <div className="flex items-center gap-3 mb-2">
              <TaxReturnBadge needed={needsTaxReturn} />
              <span className="text-sm text-gray-700">
                副業所得：{formatYen(annualSideNetIncome)}
              </span>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-1">
              {needsTaxReturn ? (
                <>
                  <p>副業の年間所得が20万円を超えるため、確定申告が必要です。</p>
                  <p>申告期間は翌年2月16日〜3月15日です。</p>
                </>
              ) : (
                <>
                  <p>※ 所得税の確定申告は不要ですが、住民税の申告は別途必要な場合があります。</p>
                  <p>お住まいの市区町村の窓口にお問い合わせください。</p>
                </>
              )}
            </div>
          </div>

          {/* 会社バレリスク */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">会社バレリスク</p>
            <div className="flex items-center gap-3 mb-2">
              <BaleRiskBadge level={baleRisk} />
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-1">
              {baleRisk === 'high' && (
                <>
                  <p>確定申告の際、住民税の徴収方法を「普通徴収（自分で納付）」に設定してください。</p>
                  <p>設定しないと会社の給与に上乗せされ、バレる可能性があります。</p>
                </>
              )}
              {baleRisk === 'medium' && (
                <>
                  <p>所得税の申告は不要ですが、住民税で副業収入が反映される場合があります。</p>
                  <p>市区町村に住民税の申告をする場合は普通徴収を選択しましょう。</p>
                </>
              )}
              {baleRisk === 'low' && (
                <p>副業所得がない場合はリスクなし。副業を始めたら再計算してください。</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 内訳 */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">計算の内訳</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: '副業稼働月数', value: `${activeMonths}ヶ月` },
            { label: '年間副業収入', value: formatYen(result.annualSideIncome) },
            { label: '年間副業経費', value: `▲ ${formatYen(result.annualSideExpense)}` },
            { label: '年間副業所得（収入−経費）', value: formatYen(annualSideNetIncome), bold: true },
            { label: '所得税の増加', value: `▲ ${formatYen(incomeTaxIncrease)}` },
            { label: '住民税の増加', value: `▲ ${formatYen(residentTaxIncrease)}` },
            { label: '手取り増加額', value: formatYen(takeHomeIncrease), bold: true, color: 'text-blue-700' },
          ].map((row, i) => (
            <div key={i} className={`flex justify-between items-center py-2 border-b border-gray-100 ${row.bold ? 'font-bold' : ''} ${row.color || 'text-gray-700'}`}>
              <span className="text-gray-600">{row.label}</span>
              <span className={row.color || ''}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ふるさと納税 */}
      {furusatoLimit > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-blue-800 mb-3">🏡 ふるさと納税の目安上限</h2>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-green-600">{formatYen(furusatoLimit)}</p>
            <p className="text-xs text-gray-500">（2,000円の自己負担を含む）</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ※ 副業収入を含めた課税所得をもとにした簡易計算です。家族構成・医療費控除などにより実際の上限は異なります。
          </p>
        </div>
      )}

      {/* グラフ */}
      <AnnualChart data={monthlyData} />
    </div>
  )
}
