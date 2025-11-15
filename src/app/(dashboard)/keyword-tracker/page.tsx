'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Keyword } from '@prisma/client';
import KeywordTable from '@/components/KeywordTable';
import AddKeywordModal from '@/components/AddKeywordModal';

const KeywordTrackerPage = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);

  // This fetches your keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch('/api/keywords');
        const data = await response.json();
        setKeywords(data);
      } catch (error) {
        console.error('Failed to load keywords:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  // This function handles BOTH Add and Edit
  const handleSave = async (
    keywordData: { name: string; type: string },
    id?: number
  ) => {
    if (id) {
      // UPDATE (EDIT) LOGIC
      try {
        const response = await fetch(`/api/keywords/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(keywordData),
        });
        if (!response.ok) throw new Error('Failed to update');
        const updatedKeyword = await response.json();

        setKeywords((prev) =>
          prev.map((kw) => (kw.id === id ? updatedKeyword : kw))
        );
      } catch (error) {
        console.error('Error updating keyword:', error);
      }
    } else {
      // CREATE (ADD) LOGIC
      try {
        const response = await fetch('/api/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(keywordData),
        });
        if (!response.ok) throw new Error('Failed to add');
        const newKeywordFromDB = await response.json();
        setKeywords((prev) => [newKeywordFromDB, ...prev]);
      } catch (error) {
        console.error('Error adding keyword:', error);
      }
    }
  };

  const handleDeleteKeyword = async (id: number) => {
    // This updates the UI immediately
    setKeywords((prev) => prev.filter((kw) => kw.id !== id));

    // This sends the delete request to your API
    try {
      await fetch(`/api/keywords/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting keyword:', error);
      // Here you would add logic to put the keyword back if the API call fails
    }
  };

  const openAddModal = () => {
    setEditingKeyword(null);
    setIsModalOpen(true);
  };

  const openEditModal = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSave} // <-- CHANGED from onSave to onAdd
          keywordToEdit={editingKeyword}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Keyword Tracker</h1>
          <p className="text-gray-500 mt-1">Manage and track your keywords</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
        >
          <Plus size={20} className="mr-2" />
          Add Keyword
        </button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p>Loading keywords...</p>
        ) : (
          <KeywordTable
            keywords={keywords}
            setKeywords={setKeywords}
            onDelete={handleDeleteKeyword}
            onEdit={openEditModal}
          />
        )}
      </div>
    </div>
  );
};

export default KeywordTrackerPage;
