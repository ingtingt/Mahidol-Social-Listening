import { Edit, Trash2 } from 'lucide-react';
import type { Keyword } from '@/data/mockData'; // We'll define this type

type KeywordTableProps = {
  keywords: Keyword[];
  setKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>;
};

const KeywordTable = ({ keywords, setKeywords }: KeywordTableProps) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left font-semibold text-gray-600 w-2/5">
            KEYWORD
          </th>
          <th className="p-4 text-left font-semibold text-gray-600">
            MENTIONS
          </th>
          <th className="p-4 text-left font-semibold text-gray-600 w-1/3">
            SENTIMENT
          </th>
          <th className="p-4 text-left font-semibold text-gray-600">ACTION</th>
        </tr>
      </thead>
      <tbody>
        {keywords.map((kw) => (
          <tr key={kw.id} className="border-t border-gray-200">
            <td className="p-4 font-medium">{kw.name}</td>
            <td className="p-4 text-gray-600">
              {kw.mentions.toLocaleString()}
            </td>
            <td className="p-4">
              {/* This is the stacked progress bar */}
              <div className="flex w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="bg-emerald-400 h-full rounded-l-full"
                  style={{ width: `${kw.positive}%` }}
                ></div>
                <div
                  className="bg-amber-400 h-full"
                  style={{ width: `${kw.neutral}%` }}
                ></div>
                <div
                  className="bg-red-400 h-full rounded-r-full"
                  style={{ width: `${kw.negative}%` }}
                ></div>
              </div>
            </td>
            <td className="p-4">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <Edit size={16} />
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

export default KeywordTable;
