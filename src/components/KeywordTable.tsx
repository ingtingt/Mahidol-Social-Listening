import { Edit, Trash2 } from 'lucide-react';
import type { Keyword } from '@prisma/client';
// 1. IMPORT THE SELECT COMPONENTS
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 2. UPDATE THE PROPS
type KeywordTableProps = {
  keywords: Keyword[];
  setKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>;
  onDelete: (id: number) => void;
  onEdit: (keyword: Keyword) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
};

const KeywordTable = ({
  keywords,
  setKeywords,
  onDelete,
  onEdit,
  typeFilter,
  setTypeFilter,
}: KeywordTableProps) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left font-semibold text-gray-600 w-2/5">
            KEYWORD
          </th>

          {/* 3. REPLACE THE "TYPE" TH */}
          <th className="p-4 text-left font-semibold text-gray-600">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px] bg-transparent border-none p-0 font-semibold text-gray-600 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Main">Main</SelectItem>
                <SelectItem value="Sub">Sub</SelectItem>
              </SelectContent>
            </Select>
          </th>

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
