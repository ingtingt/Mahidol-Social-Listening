import React from 'react';
import { Plus } from 'lucide-react';

type KeywordTagProps = {
  text: string;
  relevance: number;
  onOpenAddModal: (keywordName: string) => void; // 1. Renamed prop
};

const KeywordTag = ({ text, relevance, onOpenAddModal }: KeywordTagProps) => {
  const bgColor =
    relevance > 0.9
      ? 'bg-purple-100 text-purple-800'
      : relevance > 0.8
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div
      className={`inline-flex items-center rounded-full text-sm font-medium ${bgColor}`}
    >
      <span className="pl-3 pr-2 py-1">{text}</span>

      <button
        onClick={() => onOpenAddModal(text)} // 2. Call renamed prop
        className="p-1.5 rounded-full hover:bg-black/10"
        title={`Add "${text}" to Keyword Tracker`}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default KeywordTag;
