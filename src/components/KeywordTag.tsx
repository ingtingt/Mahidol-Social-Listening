import React from 'react';
import { Plus } from 'lucide-react';

type KeywordTagProps = {
  text: string;
  relevance: number;
  status: 'new' | 'existing' | 'linked'; // 1. Add this prop
  onOpenAddModal: (keywordName: string) => void;
};

const KeywordTag = ({
  text,
  relevance,
  status,
  onOpenAddModal,
}: KeywordTagProps) => {
  // 2. Choose color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'linked':
        return 'bg-red-100 text-red-800'; // Red = Already linked to this post
      case 'existing':
        return 'bg-yellow-100 text-yellow-800'; // Yellow = Exists, but not linked
      case 'new':
      default:
        // Use relevance for 'new' keywords
        return relevance > 0.8
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800';
    }
  };

  const bgColor = getStatusColor();
  const isLinked = status === 'linked';

  return (
    <div
      className={`inline-flex items-center rounded-full text-sm font-medium ${bgColor}`}
    >
      <span className="pl-3 pr-2 py-1">{text}</span>

      {/* 3. Disable the button if the keyword is already linked */}
      <button
        onClick={() => onOpenAddModal(text)}
        className="p-1.5 rounded-full hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
        title={
          isLinked
            ? `"${text}" is already linked to this post`
            : `Add "${text}" to Keyword Tracker`
        }
        disabled={isLinked} // Disable the button
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default KeywordTag;
