'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { sentimentTrendsData, keywords } from '@/data/mockData';
import SentimentChart from '@/components/SentimentChart';
import SentimentTable from '@/components/SentimentTable';

const SentimentTrendsPage = () => {
  const [activeKeyword, setActiveKeyword] = useState('All Keywords');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sentiment Trends</h1>
        <p className="text-gray-500 mt-1">
          Analyze sentiment trends for your keywords
        </p>
      </div>

      {/* 1. This is the updated responsive filter bar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Keyword Filters */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg shadow-sm border">
          {keywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setActiveKeyword(kw)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeKeyword === kw
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Date & Filters */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <input
            type="text"
            defaultValue="01 Sep, 2024 - 14 Sep, 2024"
            className="text-sm border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="flex items-center text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50">
            <SlidersHorizontal size={16} className="mr-2 text-gray-600" />
            Filters
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <SentimentChart data={sentimentTrendsData} />
        <SentimentTable data={sentimentTrendsData} />
      </div>
    </div>
  );
};

export default SentimentTrendsPage;
