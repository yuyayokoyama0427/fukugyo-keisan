import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function AnnualChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="mb-0.5">
              {entry.name}：{entry.value}万円
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-bold text-blue-800 mb-1">年間収支シミュレーション</h2>
      <p className="text-xs text-gray-400 mb-5">棒グラフ：月次の収入・経費　折れ線：累計手取増加額</p>

      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              unit="万"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            />
            <Bar dataKey="収入" fill="#bfdbfe" radius={[3, 3, 0, 0]} maxBarSize={30} />
            <Bar dataKey="経費" fill="#fca5a5" radius={[3, 3, 0, 0]} maxBarSize={30} />
            <Bar dataKey="手取増加" fill="#6ee7b7" radius={[3, 3, 0, 0]} maxBarSize={30} />
            <Line
              type="monotone"
              dataKey="累計手取増加"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: '#2563eb', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
