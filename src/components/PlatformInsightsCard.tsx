import { ChevronDown } from 'lucide-react';
import type { PlatformInsight } from '@/data/mockData';

type CardProps = {
  insights: PlatformInsight[];
};

const PlatformInsightsCard = ({ insights }: CardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">Platform Insights</h3>
      <div className="text-sm text-gray-500 cursor-pointer">
        5 Nov - 5 Dec 2024 <ChevronDown className="inline w-4 h-4 ml-1" />
      </div>
    </div>
    <div className="space-y-4">
      {insights.map((p) => {
        const { Icon } = p;
        return (
          <div
            key={p.platform}
            className="border border-gray-100 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Icon className="w-6 h-6" />
                <div className="ml-3">
                  <p className="font-bold text-sm">{p.platform}</p>
                  <p className="text-xs text-gray-500">{p.posts}</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-purple-600 border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50">
                See detail
              </button>
            </div>
            <div className="flex justify-between text-center">
              <div>
                <p className="font-bold text-lg text-emerald-500">
                  {p.positive.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Positive</p>
              </div>
              <div>
                <p className="font-bold text-lg text-amber-500">
                  {p.neutral.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Neutral</p>
              </div>
              <div>
                <p className="font-bold text-lg text-red-500">
                  {p.negative.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Negative</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default PlatformInsightsCard;
