'use client';

import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import type { ExtractorResults } from '@/data/mockData';
import ResultsPanel from '@/components/ResultsPanel';
import AddKeywordModal from '@/components/AddKeywordModal'; // 1. Import the modal
import { Keyword } from '@prisma/client'; // 2. Import the Keyword type

const KeywordExtractorPage = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<ExtractorResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordToAdd, setKeywordToAdd] = useState<Partial<Keyword> | null>(
    null
  );
  const handleExtract = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Send the text
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Create the 'stats' object ourselves
      const wordCount = text.trim().split(/\s+/).length;
      const keywordsFound =
        (data.mainKeywords?.length || 0) + (data.subKeywords?.length || 0);

      // Set the final results to update the UI
      setResults({
        mainKeywords: (data.mainKeywords || []).map((kw: string) => ({
          text: kw,
          relevance: 0.9,
        })), // Add relevance
        subKeywords: (data.subKeywords || []).map((kw: string) => ({
          text: kw,
          relevance: 0.7,
        })), // Add relevance
        stats: {
          wordCount,
          keywordsFound,
        },
      });
    } catch (error) {
      console.error('Error extracting keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKeyword = async (keywordName: string) => {
    try {
      // We'll default all extracted keywords to "Sub" type
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keywordName,
          type: 'Sub', // Defaulting to 'Sub'
        }),
      });

      if (response.status === 409) {
        // 409 is the "Conflict" error we set up for duplicates
        alert(`Keyword "${keywordName}" already exists in your tracker.`);
      } else if (!response.ok) {
        throw new Error('Failed to add keyword');
      } else {
        alert(`Added "${keywordName}" to your Keyword Tracker!`);
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
      alert(`Could not save keyword "${keywordName}".`);
    }
  };
  const handleOpenAddModal = (
    keywordName: string,
    keywordType: 'Main' | 'Sub'
  ) => {
    // Set the keyword to add, pre-filling the name
    setKeywordToAdd({
      name: keywordName,
      type: keywordType,
    });
    setIsModalOpen(true);
  };
  const handleSaveFromModal = async (
    keywordData: { name: string; type: string },
    id?: number // id will be undefined, so this will only do "ADD" logic
  ) => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keywordData.name, // Use the name from the modal
          type: keywordData.type, // Use the type from the modal
        }),
      });

      if (response.status === 409) {
        alert(`Keyword "${keywordData.name}" already exists.`);
      } else if (!response.ok) {
        throw new Error('Failed to add keyword');
      } else {
        alert(`Added "${keywordData.name}" to your Keyword Tracker!`);
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
      alert(`Could not save keyword "${keywordData.name}".`);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSaveFromModal}
          // We pass our pre-filled keyword data as the 'keywordToEdit' prop
          // The modal will see this and pre-fill its form
          keywordToEdit={keywordToAdd as Keyword | null}
        />
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Keyword Extractor</h1>
        <p className="text-gray-500 mt-1">
          Extract keywords from any block of text automatically.
        </p>
      </div>

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
        <ResultsPanel
          results={results}
          isLoading={isLoading}
          onOpenAddModal={handleOpenAddModal}
        />
      </div>
    </div>
  );
};

export default KeywordExtractorPage;
