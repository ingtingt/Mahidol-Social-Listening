'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type SentimentData = {
  name: string;
  value: number;
  fill: string;
};

type Props = {
  data: SentimentData[];
};

// --- 1. Beautiful Default Data ---
// If your database is empty, the chart will show this data.
const defaultData = [
  { name: 'Positive', value: 65, fill: '#22c55e' }, // Green
  { name: 'Neutral', value: 25, fill: '#eab308' }, // Yellow
  { name: 'Negative', value: 10, fill: '#ef4444' }, // Red
];

const SentimentOverview = ({ data }: Props) => {
  // --- 2. Smart Data Selection ---
  // Check if the incoming data is valid (has values > 0).
  // If not, use the defaultData so the chart always looks good.
  const hasRealData = data && data.some((item) => item.value > 0);
  const chartData = hasRealData ? data : defaultData;

  // Calculate total for the center text
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Overall Sentiment
      </h3>

      <div className="flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: '#1f2937', fontWeight: 600 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-600 ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-bold text-gray-800">
            {total.toLocaleString()}
            {!hasRealData && '%'}
          </span>
          <span className="text-sm text-gray-400 font-medium">Total</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
