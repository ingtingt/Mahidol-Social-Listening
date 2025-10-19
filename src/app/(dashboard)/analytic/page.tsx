import React from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
import { analyticData, platformData, topKeywordsData } from '@/data/mockData';
import AnalyticSummaryCard from '@/components/AnalyticSummaryCard';
import SentimentAreaChart from '@/components/SentimentAreaChart';
import PlatformPerformance from '@/components/PlatformPerformance';
import KeywordAnalysis from '@/components/KeywordAnalysis';

const AnalyticPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Report</h1>
          <p className="text-gray-500 mt-1">
            Showing data for the last 30 days.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50">
            <SlidersHorizontal size={16} className="mr-2 text-gray-600" />
            Filters
          </button>
          <button className="flex items-center text-sm bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-purple-700">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticSummaryCard
          title="Total Mentions"
          value="9,481"
          change={12.5}
        />
        <AnalyticSummaryCard
          title="Positive Sentiment"
          value="68%"
          change={5.2}
        />
        <AnalyticSummaryCard
          title="Top Platform"
          value="Facebook"
          change={-2.1}
        />
        <AnalyticSummaryCard title="Top Keyword" value="MUIC" change={18.9} />
      </div>

      <div>
        <SentimentAreaChart data={analyticData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformPerformance data={platformData} />
        <KeywordAnalysis data={topKeywordsData} />
      </div>
    </div>
  );
};

export default AnalyticPage;
