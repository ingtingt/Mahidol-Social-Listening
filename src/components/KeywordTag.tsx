import React from 'react';

type KeywordTagProps = {
  text: string;
  relevance: number;
};

const KeywordTag = ({ text, relevance }: KeywordTagProps) => {
  const bgColor =
    relevance > 0.9
      ? 'bg-purple-100 text-purple-800'
      : relevance > 0.8
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
    >
      {text}
    </span>
  );
};

export default KeywordTag;
