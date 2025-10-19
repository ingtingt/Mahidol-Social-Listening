'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { keywords as allKeywords, sentimentTrendsData } from '@/data/mockData';
import SentimentChart from '@/components/SentimentChart';
import SentimentTable from '@/components/SentimentTable';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VISIBLE_KEYWORDS = 4;
const visibleKeywords = allKeywords.slice(0, VISIBLE_KEYWORDS);
const dropdownKeywords = allKeywords.slice(VISIBLE_KEYWORDS);

const SentimentTrendsPage = () => {
  const [activeKeyword, setActiveKeyword] = useState('All Keywords');

  const isDropdownKeywordActive = dropdownKeywords.includes(activeKeyword);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sentiment Trends</h1>
        <p className="text-gray-500 mt-1">
          Analyze sentiment trends for your keywords
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Keyword Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg shadow-sm border">
          {visibleKeywords.map((kw) => (
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

          {/* 4. Render the dropdown for the rest of the keywords */}
          {dropdownKeywords.length > 0 && (
            <Select
              value={isDropdownKeywordActive ? activeKeyword : ''}
              onValueChange={setActiveKeyword}
            >
              <SelectTrigger
                className={`w-auto px-4 py-1.5 text-sm font-semibold rounded-md border-none focus:ring-0 ${
                  isDropdownKeywordActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SelectValue placeholder="More" />
              </SelectTrigger>
              <SelectContent>
                {dropdownKeywords.map((kw) => (
                  <SelectItem key={kw} value={kw}>
                    {kw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Date & Filters */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <DatePickerWithRange />
          {/* <button className="flex items-center text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50">
            <SlidersHorizontal size={16} className="mr-2 text-gray-600" />
            Filters
          </button> */}
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
