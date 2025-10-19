import type { TopKeyword } from '@/data/mockData';

type ListProps = {
  data: TopKeyword[];
};

const KeywordAnalysis = ({ data }: ListProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-bold">Top Keywords</h3>
    <div className="space-y-4 mt-4">
      {data
        .sort((a, b) => b.mentions - a.mentions)
        .map((kw) => (
          <div key={kw.name}>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="font-semibold">{kw.name}</span>
              <span className="text-gray-500">{kw.mentions} mentions</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${(kw.mentions / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
    </div>
  </div>
);

export default KeywordAnalysis;
