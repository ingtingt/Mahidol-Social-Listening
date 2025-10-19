'use client';

import React from 'react';
import {
  Plus,
  MoreVertical,
  Trash2,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import type { DataSource } from '@/data/mockData';

type ManageSourcesProps = {
  sources: DataSource[];
  setSources: React.Dispatch<React.SetStateAction<DataSource[]>>;
};

const ManageSources = ({ sources, setSources }: ManageSourcesProps) => {
  const toggleStatus = (id: number) => {
    setSources(
      sources.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' }
          : s
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Data Sources</h3>
        <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-700">
          <Plus size={16} className="mr-2" />
          Add New Source
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">
              PLATFORM
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              STATUS
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              TRACKED KEYWORDS
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              LAST COLLECTED
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id} className="border-t border-gray-200">
              <td className="p-4 font-medium flex items-center">
                {/* THE COLOR FIX IS HERE 👇 */}
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: source.color }}
                ></div>
                {source.platform}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    source.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {source.status}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                {source.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md mr-1 text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </td>
              <td className="p-4 text-gray-600">{source.lastCollected}</td>
              <td className="p-4">
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleStatus(source.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    {source.status === 'Active' ? (
                      <PauseCircle size={16} />
                    ) : (
                      <PlayCircle size={16} />
                    )}
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSources;
