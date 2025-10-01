'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  onClose: () => void;
  onAdd: (keyword: { name: string; type: string }) => void;
};

const AddKeywordModal = ({ onClose, onAdd }: ModalProps) => {
  const [keyword, setKeyword] = useState('');
  const [mainKeyword, setMainKeyword] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onAdd({ name: keyword, type: mainKeyword ? 'Main' : 'Sub' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Keyword</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Keyword Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., MUIC Admission"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Keyword Type Radio Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keyword Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="keywordType"
                  checked={mainKeyword}
                  onChange={() => setMainKeyword(true)}
                  className="form-radio text-purple-600 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Main Keyword</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="keywordType"
                  checked={!mainKeyword}
                  onChange={() => setMainKeyword(false)}
                  className="form-radio text-purple-600 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Sub-Keyword</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
            >
              Add Keyword
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKeywordModal;
