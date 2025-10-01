import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import type { CalendarDay, TopMessage } from '@/data/mockData';

type CardProps = {
  days: CalendarDay[];
  messages: TopMessage[];
};

const TopMessagesCard = ({ days, messages }: CardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg">Top Messages by engagement</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">November 2024</p>

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

      <div className="space-y-4">
        {messages.map((item, index) => {
          const { PlatformIcon } = item;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="w-16 text-sm text-gray-500 pt-3">{item.time}</div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-2">
                    <PlatformIcon className="w-5 h-5" />
                    <span className="ml-2 font-semibold text-sm">
                      {item.platform}
                    </span>
                  </div>
                  <MoreHorizontal className="text-gray-400 cursor-pointer" />
                </div>
                <p className="text-sm text-gray-700 mb-3">{item.message}</p>
                {item.imageUrls.length > 0 && (
                  <div className="flex space-x-2">
                    {item.imageUrls.slice(0, 2).map((url, i) => (
                      <Image
                        key={i}
                        src={url}
                        alt="engagement image"
                        width={80}
                        height={60}
                        className="rounded-md w-1/3 object-cover shadow-md"
                      />
                    ))}
                    {item.images > 2 && (
                      <div className="rounded-md w-1/3 bg-purple-100 flex items-center justify-center font-bold text-purple-700 shadow-md">
                        +{item.images - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMessagesCard;
