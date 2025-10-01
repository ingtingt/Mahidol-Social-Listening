import AttendanceChart from '@/components/AttendanceChart';
import CountChart from '@/components/CountChart';
import UserCard from '@/components/UserCard';
import StatCard from '@/components/StatCard';
import {
  Users,
  BarChart,
  MessageSquare,
  Users2,
  MessageSquareText,
  MessageCircleMore,
  BarChart2,
} from 'lucide-react';
import React from 'react';
import SentimentCard from '@/components/SentimentCard';
import TopMessagesCard from '@/components/TopMessagesCard';
import {
  platformInsightsData,
  sentimentData,
  socialMediaCardData,
  calendarDaysData,
  topMessagesData,
} from '@/data/mockData';
import SocialMediaBreakdownCard from '@/components/SocialMediaBreakdownCard';
import PlatformInsightsCard from '@/components/PlatformInsightsCard';

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
          Icon={Users2}
        />
        <StatCard
          title="Main Keyword Mentions"
          value="6,650"
          change={14}
          changeText="+ 210 today"
          Icon={MessageSquareText}
        />
        <StatCard
          title="Sub-Keyword Messages"
          value="5,514"
          change={20}
          changeText="+ 70 today"
          Icon={MessageCircleMore}
        />
        <StatCard
          title="Total Engagements"
          value="5,514"
          change={-10}
          changeText="- 60 today"
          Icon={BarChart2}
        />
      </div>

      {/* Sentiment Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Sentiment chart will go here */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SentimentCard data={sentimentData} />
          <TopMessagesCard days={calendarDaysData} messages={topMessagesData} />
        </div>

        {/* Social Media Breakdown will go here */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SocialMediaBreakdownCard data={socialMediaCardData} />
          <PlatformInsightsCard insights={platformInsightsData} />
        </div>
      </div>

      {/* Bottom chart section (placeholder) */}
      <div></div>
    </div>
  );
};

export default Overviewpage;
