import { ArrowUp, ArrowDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  change: number;
  changeText: string;
  Icon: LucideIcon;
};

const StatCard = ({
  title,
  value,
  change,
  changeText,
  Icon,
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="flex-1 bg-white p-6 rounded-lg shadow-sm flex flex-col gap-4">
      {/* Top Section: Title and Icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="bg-blue-50 text-blue-500 p-2 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Middle Section: Main Value */}
      <div>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>

      {/* Bottom Section: Change Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className={`
            flex items-center gap-1 px-2 py-1 rounded-full
            ${
              isPositive
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-red-100 text-red-600'
            }
          `}
        >
          {isPositive ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
        <span className="text-gray-500">{changeText}</span>
      </div>
    </div>
  );
};

export default StatCard;
