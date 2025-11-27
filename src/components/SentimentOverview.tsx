'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
const defaultData = [
  { name: 'Positive', value: 450, fill: '#22c55e' }, // Green
  { name: 'Neutral', value: 200, fill: '#eab308' }, // Yellow
  { name: 'Negative', value: 50, fill: '#ef4444' }, // Red
];

const SentimentOverview = ({ data }: Props) => {
  // Use the passed data if it has values, otherwise use the default mock data
  const hasRealData = data && data.some((item) => item.value > 0);
  const chartData = hasRealData ? data : defaultData;

  // 2. Transform the data into the single-row stacked format
  // [{ name: 'Total', Positive: 450, Neutral: 200, Negative: 50 }]
  const transformedData = [
    {
      name: 'Total',
      ...Object.fromEntries(chartData.map((item) => [item.name, item.value])),
    },
  ];

  const total =
    transformedData[0].Positive +
    transformedData[0].Neutral +
    transformedData[0].Negative;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Overall Sentiment Breakdown
      </h3>

      <div className="flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            layout="horizontal"
            stackOffset="expand" // 3. Makes it a 100% stacked bar
            barSize={30}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" hide dataKey="name" />
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              // Show percentage and value in the tooltip
              formatter={(value, name, props) => {
                const percent = (props.payload[name] / total) * 100;
                return [
                  `${value.toLocaleString()} (${percent.toFixed(1)}%)`,
                  name,
                ];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              // Show the percentage next to the category name
              formatter={(value) => {
                const percent = (transformedData[0][value] / total) * 100;
                return (
                  <span className="text-sm text-gray-600 ml-1">
                    {value} ({percent.toFixed(1)}%)
                  </span>
                );
              }}
              wrapperStyle={{ paddingTop: '20px' }}
            />

            {/* 4. Render the stacked bars */}
            {chartData.map((item) => (
              <Bar
                key={item.name}
                dataKey={item.name}
                stackId="a" // All bars belong to the same stack
                fill={item.fill}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* 5. Center Text (Total Count) */}
        <div className="text-center mt-4">
          <span className="text-xl font-bold text-gray-800">
            {total.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 font-medium ml-2">
            Total Comments/Posts Analyzed
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
