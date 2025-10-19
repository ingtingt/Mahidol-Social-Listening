'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DataSource } from '@/data/mockData';

type ScheduleProps = {
  sources: DataSource[];
};

const CollectionSchedule = ({ sources }: ScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 19)); // October 19, 2025

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDate = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  // This logic is hardcoded in your example, so we'll keep it.
  // It maps specific dates to the sources array.
  const scheduledEvents: { [key: number]: DataSource[] } = {
    3: [sources[0]],
    5: [sources[1], sources[3]],
    10: [sources[0]],
    12: [sources[1]],
    17: [sources[0]],
    19: [sources[1], sources[3]],
    25: [sources[0], sources[1]],
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: startDate }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            day === 19 &&
            currentDate.getMonth() === 9 &&
            currentDate.getFullYear() === 2025; // Hardcoded 'today'
          return (
            <div key={day} className="border-t py-2">
              <span
                className={`mx-auto flex items-center justify-center w-8 h-8 rounded-full ${
                  isToday ? 'bg-purple-600 text-white' : ''
                }`}
              >
                {day}
              </span>
              <div className="mt-1 flex justify-center space-x-1">
                {scheduledEvents[day] &&
                  scheduledEvents[day].map((event) => (
                    // THE COLOR FIX IS HERE 👇
                    <div
                      key={event.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    ></div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionSchedule;
