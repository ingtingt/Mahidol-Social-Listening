'use client';

import React, { useState } from 'react';
import { initialSources } from '@/data/mockData';
import type { DataSource } from '@/data/mockData';
import ManageSources from '@/components/ManageSources';
import CollectionSchedule from '@/components/CollectionSchedule';

const DataCollectionPage = () => {
  const [activeTab, setActiveTab] = useState('Manage');
  const [sources, setSources] = useState<DataSource[]>(initialSources);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Data Collection</h1>
        <p className="text-gray-500 mt-1">
          Manage sources and view collection schedules.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('Manage')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Manage'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Manage Sources
          </button>
          <button
            onClick={() => setActiveTab('Schedule')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Schedule'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Collection Schedule
          </button>

          {/* 1. ADDED THE NEW DATABASE TAB BUTTON */}
          <button
            onClick={() => setActiveTab('Database')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Database'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Database
          </button>
        </div>
      </div>

      <div>
        {/* 2. ADDED THE LOGIC TO SHOW THE DATABASE TAB CONTENT */}
        {activeTab === 'Manage' && (
          <ManageSources sources={sources} setSources={setSources} />
        )}
        {activeTab === 'Schedule' && <CollectionSchedule sources={sources} />}
        {activeTab === 'Database' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold">Database Management</h3>
            <p className="mt-2 text-gray-600">Database Content will go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollectionPage;
