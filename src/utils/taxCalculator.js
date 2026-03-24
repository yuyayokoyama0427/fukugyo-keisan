/**
 * 副業ぜんぶ計算くん - 税金計算ユーティリティ
 * ※ 簡易計算のため、実際の税額と異なる場合があります。詳細は税理士にご確認ください。
 */

// 所得税の速算表
const INCOME_TAX_TABLE = [
  { limit: 1950000,  rate: 0.05, deduction: 0 },
  { limit: 3300000,  rate: 0.10, deduction: 97500 },
  { limit: 6950000,  rate: 0.20, deduction: 427500 },
  { limit: 9000000,  rate: 0.23, deduction: 636000 },
  { limit: 18000000, rate: 0.33, deduction: 1536000 },
  { limit: 40000000, rate: 0.40, deduction: 2796000 },
  { limit: Infinity, rate: 0.45, deduction: 4796000 },
]

/**
 * 課税所得から所得税を計算する
 * @param {number} taxableIncome - 課税所得（円）
 * @returns {number} 所得税額（円）
 */
export function calcIncomeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0
  const bracket = INCOME_TAX_TABLE.find(b => taxableIncome <= b.limit)
  return Math.floor(taxableIncome * bracket.rate - bracket.deduction)
}

/**
 * 課税所得から住民税を計算する（一律10%）
 * @param {number} taxableIncome - 課税所得（円）
 * @returns {number} 住民税額（円）
 */
export function calcResidentTax(taxableIncome) {
  if (taxableIncome <= 0) return 0
  return Math.floor(taxableIncome * 0.10)
}

/**
 * 給与所得控除を計算する（簡易版）
 * @param {number} salary - 給与収入（円）
 * @returns {number} 給与所得控除額（円）
 */
export function calcEmploymentDeduction(salary) {
  if (salary <= 1625000) return 550000
  if (salary <= 1800000) return Math.floor(salary * 0.40) - 100000
  if (salary <= 3600000) return Math.floor(salary * 0.30) + 80000
  if (salary <= 6600000) return Math.floor(salary * 0.20) + 440000
  if (salary <= 8500000) return Math.floor(salary * 0.10) + 1100000
  return 1950000
}

/**
 * メインの計算関数
 * @param {Object} inputs
 * @param {number} inputs.mainJobIncome - 本業年収（万円）
 * @param {number} inputs.sideIncome - 副業月収（万円）※単一副業モード用
 * @param {number} inputs.sideExpense - 副業月間経費（万円）※単一副業モード用
 * @param {number} inputs.startMonth - 副業開始月（1〜12）
 * @param {Array}  [inputs.sideJobs] - 複数副業リスト [{name, income, expense}] ※Pro版
 * @returns {Object} 計算結果
 */
export function calculate(inputs) {
  const { mainJobIncome, sideIncome, sideExpense, startMonth, sideJobs } = inputs

  // 万円 → 円 に変換
  const mainIncomeYen = mainJobIncome * 10000

  // 副業の稼働月数（開始月〜12月）
  const activeMonths = Math.max(0, 13 - startMonth)

  // 年間副業収入・経費・所得
  let annualSideIncome = 0
  let annualSideExpense = 0

  if (sideJobs && sideJobs.length > 0) {
    // Pro版：複数副業を合算
    for (const job of sideJobs) {
      const inc = (Number(job.income) || 0) * 10000
      const exp = (Number(job.expense) || 0) * 10000
      annualSideIncome += inc * activeMonths
      annualSideExpense += exp * activeMonths
    }
  } else {
    // 無料版：単一副業
    const sideIncomeMonthYen = (Number(sideIncome) || 0) * 10000
    const sideExpenseMonthYen = (Number(sideExpense) || 0) * 10000
    annualSideIncome = sideIncomeMonthYen * activeMonths
    annualSideExpense = sideExpenseMonthYen * activeMonths
  }

  const annualSideNetIncome = Math.max(0, annualSideIncome - annualSideExpense)

  // 基礎控除（2020年〜）：合計所得2400万以下は48万円
  const basicDeduction = 480000

  // 本業のみの課税所得
  const mainEmploymentDeduction = calcEmploymentDeduction(mainIncomeYen)
  const mainTaxableIncome = Math.max(0, mainIncomeYen - mainEmploymentDeduction - basicDeduction)

  // 本業＋副業の課税所得
  const totalTaxableIncome = Math.max(0, mainTaxableIncome + annualSideNetIncome)

  // 所得税：本業のみ
  const mainIncomeTax = calcIncomeTax(mainTaxableIncome)
  const mainResidentTax = calcResidentTax(mainTaxableIncome)

  // 所得税：本業＋副業
  const totalIncomeTax = calcIncomeTax(totalTaxableIncome)
  const totalResidentTax = calcResidentTax(totalTaxableIncome)

  // 税金増加額
  const incomeTaxIncrease = Math.max(0, totalIncomeTax - mainIncomeTax)
  const residentTaxIncrease = Math.max(0, totalResidentTax - mainResidentTax)
  const totalTaxIncrease = incomeTaxIncrease + residentTaxIncrease

  // 手取り増加額
  const takeHomeIncrease = Math.max(0, annualSideNetIncome - totalTaxIncrease)

  // 確定申告の要否（20万円ルール）
  const needsTaxReturn = annualSideNetIncome > 200000

  // 会社バレリスクレベル
  let baleRisk
  if (annualSideNetIncome > 200000) {
    baleRisk = 'high'
  } else if (annualSideNetIncome > 0) {
    baleRisk = 'medium'
  } else {
    baleRisk = 'low'
  }

  // 月ごとの収支シミュレーション
  // 複数副業の月次合計を計算
  let monthlyTotalGross = 0
  let monthlyTotalExpense = 0
  if (sideJobs && sideJobs.length > 0) {
    for (const job of sideJobs) {
      monthlyTotalGross += (Number(job.income) || 0) * 10000
      monthlyTotalExpense += (Number(job.expense) || 0) * 10000
    }
  } else {
    monthlyTotalGross = (Number(sideIncome) || 0) * 10000
    monthlyTotalExpense = (Number(sideExpense) || 0) * 10000
  }

  const monthlyData = []
  let cumulativeNet = 0
  let cumulativeTax = 0

  for (let month = 1; month <= 12; month++) {
    const isActive = month >= startMonth
    const monthlyGross = isActive ? monthlyTotalGross : 0
    const monthlyExpense = isActive ? monthlyTotalExpense : 0
    const monthlyNet = monthlyGross - monthlyExpense

    // 月次の概算税負担（年間税増加額を稼働月で按分）
    const monthlyTaxBurden = isActive && activeMonths > 0
      ? Math.round(totalTaxIncrease / activeMonths)
      : 0

    cumulativeNet += monthlyNet
    cumulativeTax += monthlyTaxBurden

    monthlyData.push({
      month: `${month}月`,
      収入: Math.round(monthlyGross / 10000),
      経費: Math.round(monthlyExpense / 10000),
      手取増加: Math.round(Math.max(0, monthlyNet - monthlyTaxBurden) / 10000),
      累計手取増加: Math.round(Math.max(0, cumulativeNet - cumulativeTax) / 10000),
    })
  }

  return {
    // 基本情報
    activeMonths,
    annualSideIncome,
    annualSideExpense,
    annualSideNetIncome,

    // 税金
    incomeTaxIncrease,
    residentTaxIncrease,
    totalTaxIncrease,

    // 手取り
    takeHomeIncrease,

    // 確定申告
    needsTaxReturn,

    // 会社バレリスク
    baleRisk,

    // グラフデータ
    monthlyData,
  }
}

/**
 * 月次データをCSV文字列に変換してダウンロードする（Pro版）
 * @param {Object} result - calculate()の戻り値
 */
export function exportMonthlyCSV(result) {
  const { monthlyData, annualSideIncome, annualSideExpense, annualSideNetIncome, totalTaxIncrease, takeHomeIncrease } = result

  const header = ['月', '収入(万円)', '経費(万円)', '手取増加(万円)', '累計手取増加(万円)']
  const rows = monthlyData.map(row => [
    row['月'],
    row['収入'],
    row['経費'],
    row['手取増加'],
    row['累計手取増加'],
  ])

  // サマリー行
  const summary = [
    [],
    ['年間合計'],
    ['年間副業収入(万円)', Math.round(annualSideIncome / 10000)],
    ['年間副業経費(万円)', Math.round(annualSideExpense / 10000)],
    ['年間副業所得(万円)', Math.round(annualSideNetIncome / 10000)],
    ['税金増加額(万円)', Math.round(totalTaxIncrease / 10000)],
    ['手取り増加額(万円)', Math.round(takeHomeIncrease / 10000)],
  ]

  const allRows = [header, ...rows, ...summary]
  const csv = allRows.map(row => row.join(',')).join('\n')

  // BOM付きUTF-8（Excel対応）
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '副業収支シミュレーション.csv'
  a.click()
  URL.revokeObjectURL(url)
}
