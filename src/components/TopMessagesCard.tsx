'use client';

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Wand2,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import type { CalendarDay } from '@/data/mockData';
import type { Post as PostType } from '@prisma/client'; // 1. Import the REAL Post type

// Map platform names from your database to icons
const platformIconMap: { [key: string]: React.ElementType } = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  default: MoreHorizontal,
};

// 2. Update the props to accept PostType and the onExtract function
type CardProps = {
  days: CalendarDay[];
  messages: PostType[];
  onExtract: (post: PostType) => void;
};

const TopMessagesCard = ({ days, messages, onExtract }: CardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg">Top Messages by engagement</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">November 2024</p>

      {/* This calendar part still uses mock data */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <div className="flex space-x-1 md:space-x-4">
          {days.map((d) => (
            <div
              key={d.date}
              className={`text-center p-2 rounded-lg cursor-pointer ${
                d.active ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-xs">{d.day}</p>
              <p className="font-bold text-sm md:text-base">{d.date}</p>
            </div>
          ))}
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight />
        </button>
      </div>

      {/* 3. This section now maps over REAL data (PostType[]) */}
      <div className="space-y-4">
        {messages.map((item) => {
          // Use the real 'platform' string to get the icon
          const PlatformIcon =
            platformIconMap[item.platform] || platformIconMap.default;

          return (
            <div key={item.id} className="flex items-start gap-4">
              {/* Use the real 'createdAt' date */}
              <div className="w-16 text-sm text-gray-500 pt-3">
                {new Date(item.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-2">
                    <PlatformIcon className="w-5 h-5" />
                    <span className="ml-2 font-semibold text-sm">
                      {item.platform}
                    </span>
                  </div>

                  <button
                    onClick={() => onExtract(item)}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded-full"
                    title="Suggest Keywords"
                  >
                    <Wand2 size={16} />
                  </button>
                </div>
                {/* Use the real 'content' field */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMessagesCard;
