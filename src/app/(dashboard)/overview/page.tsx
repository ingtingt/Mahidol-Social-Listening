import AttendanceChart from '@/components/AttendanceChart';
import CountChart from '@/components/CountChart';
import UserCard from '@/components/UserCard';
import StatCard from '@/components/StatCard';
import { Users, BarChart, MessageSquare } from 'lucide-react';
import React from 'react';

const Overviewpage = () => {
  return (
    // Main container for the overview page
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-gray-500">Page / Overview</p>
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages Collected"
          value="6,650"
          change={14}
          changeText="+ 210 today"
          Icon={MessageSquare}
        />
        <StatCard
          title="Total Messages Collected"
          value="6,650"
          change={14}
          changeText="+ 210 today"
          Icon={MessageSquare}
        />
        <StatCard
          title="Main Keyword Mentions"
          value="5,514"
          change={20}
          changeText="+ 70 today"
          Icon={BarChart}
        />
        <StatCard
          title="Main Keyword Mentions"
          value="5,514"
          change={-10}
          changeText="- 60 today"
          Icon={Users}
        />
      </div>

      {/* Middle chart section (placeholder) */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Sentiment chart will go here */}
        <div className="w-full lg:w-2/3 h-[450px] bg-white rounded-lg shadow-sm p-6">
          <CountChart />
        </div>

        {/* Social Media Breakdown will go here */}
        <div className="w-full lg:w-1/3 h-[450px] bg-white rounded-lg shadow-sm p-6">
          <AttendanceChart />
        </div>
      </div>

      {/* Bottom chart section (placeholder) */}
      <div></div>
    </div>
  );
};

export default Overviewpage;
