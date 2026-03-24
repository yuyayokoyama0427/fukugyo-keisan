import React from 'react'

function AdviceItem({ text }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="mt-0.5 text-green-500 font-bold text-sm flex-shrink-0">&#9654;</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  )
}

export default function TaxAdvice({ result }) {
  if (!result) return null

  const { needsTaxReturn, baleRisk, annualSideNetIncome, annualSideExpense } = result

  const advices = []

  // 確定申告が必要な場合
  if (needsTaxReturn) {
    advices.push('確定申告の際に住民税の徴収方法を「普通徴収（自分で納付）」に設定してください。これにより会社への通知を防ぎ、会社バレのリスクを下げられます。')
    advices.push('確定申告はe-Taxを使うとオンラインで完結します。マイナンバーカードがあればスマートフォンからも申告できます。')
  }

  // 経費が少ない場合
  if (annualSideNetIncome > 0 && annualSideExpense === 0) {
    advices.push('副業に関連する支出（通信費・書籍代・PCなど）は経費として計上できる場合があります。領収書やレシートを保管しておくと節税につながります。')
  }

  // 所得が多い場合
  if (annualSideNetIncome > 1000000) {
    advices.push('年間副業所得が100万円を超えた場合、個人事業主として開業届を提出すると青色申告特別控除（最大65万円）が受けられ、大きく節税できる可能性があります。')
  }

  // 共通アドバイス
  advices.push('副業収入は毎月記録しておくことをおすすめします。確定申告の際に収支をまとめやすくなります。')
  advices.push('副業の種類によっては所得区分（事業所得・雑所得）が異なり、税額に影響します。判断が難しい場合は税理士への相談を検討してください。')

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-600 text-xl">&#128161;</span>
        <h2 className="text-lg font-bold text-blue-800">節税アドバイス</h2>
      </div>
      <div>
        {advices.map((text, i) => (
          <AdviceItem key={i} text={text} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        ※ 上記はあくまで一般的な情報です。詳細は税理士・税務署にご確認ください。
      </p>
    </div>
  )
}
