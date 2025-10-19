'use client';

import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { dummyResults } from '@/data/mockData';
import type { ExtractorResults } from '@/data/mockData';
import ResultsPanel from '@/components/ResultsPanel';

const KeywordExtractorPage = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<ExtractorResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(dummyResults);
      setIsLoading(false);
    }, 2000); // Simulate API call
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Keyword Extractor</h1>
        <p className="text-gray-500 mt-1">
          Extract keywords from any block of text automatically.
        </p>
      </div>

      {/* Set a min-height to ensure panels don't collapse on small screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[60vh]">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Input Text</h2>
            <button
              onClick={() => setText('')}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full flex-1 p-4 resize-none focus:outline-none rounded-b-xl text-gray-700 leading-relaxed"
          ></textarea>
          <div className="p-4 border-t">
            <button
              onClick={handleExtract}
              disabled={isLoading || !text.trim()}
              className="w-full flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              <Wand2 size={20} className="mr-2" />
              {isLoading ? 'Analyzing...' : 'Extract Keywords'}
            </button>
          </div>
        </div>

        {/* Results Panel Component */}
        <ResultsPanel results={results} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default KeywordExtractorPage;
