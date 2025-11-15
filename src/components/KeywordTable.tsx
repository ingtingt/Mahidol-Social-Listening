import { Edit, Trash2 } from 'lucide-react';
import type { Keyword } from '@prisma/client';

type KeywordTableProps = {
  keywords: Keyword[];
  setKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>;
  onDelete: (id: number) => void;
  onEdit: (keyword: Keyword) => void;
};

const KeywordTable = ({
  keywords,
  setKeywords,
  onDelete,
  onEdit,
}: KeywordTableProps) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left font-semibold text-gray-600 w-2/5">
            KEYWORD
          </th>
          {/* 2. Changed columns to match your real data */}
          <th className="p-4 text-left font-semibold text-gray-600">TYPE</th>
          <th className="p-4 text-left font-semibold text-gray-600">
            DATE ADDED
          </th>
          <th className="p-4 text-left font-semibold text-gray-600">ACTION</th>
        </tr>
      </thead>
      <tbody>
        {keywords.map((kw) => (
          <tr key={kw.id} className="border-t border-gray-200">
            <td className="p-4 font-medium">{kw.name}</td>

            {/* 3. Displayed the real data fields */}
            <td className="p-4 text-gray-600">{kw.type}</td>
            <td className="p-4 text-gray-600">
              {new Date(kw.createdAt).toLocaleDateString()}
            </td>

            <td className="p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(kw)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(kw.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
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
