'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { initialKeywords } from '@/data/mockData'; // We'll move the data in Step 4
import KeywordTable from '@/components/KeywordTable'; // We'll create this next
import AddKeywordModal from '@/components/AddKeywordModal'; // And this one

const KeywordTrackerPage = () => {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddKeyword = (newKeyword: { name: string; type: string }) => {
    setKeywords((prev) => [
      ...prev,
      {
        ...newKeyword,
        id: prev.length + 1,
        mentions: 0,
        positive: 0,
        neutral: 100,
        negative: 0,
      },
    ]);
  };

  return (
    <div className="relative">
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddKeyword}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Keyword Tracker</h1>
          <p className="text-gray-500 mt-1">Manage and track your keywords</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
        >
          <Plus size={20} className="mr-2" />
          Add Keyword
        </button>
      </div>

      <div className="mt-8">
        <KeywordTable keywords={keywords} setKeywords={setKeywords} />
      </div>
    </div>
  );
};

export default KeywordTrackerPage;
