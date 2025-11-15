'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import {
  Users2,
  MessageSquareText,
  MessageCircleMore,
  BarChart2,
} from 'lucide-react';
import { ChartConfig } from '@/components/ui/chart';

// Import all your components
import CategoryBreakdown from '@/components/CategoryBreakdown';
import TopMessagesCard from '@/components/TopMessagesCard';
import SocialMediaBreakdownCard from '@/components/SocialMediaBreakdownCard';
import PlatformInsightsCard from '@/components/PlatformInsightsCard';

// We still need mockData for colors and for the components we haven't connected yet
import {
  platformInsightsData,
  socialMediaCardData,
  calendarDaysData,
  topMessagesData,
  categoryDetails, // We use this ONLY for colors
} from '@/data/mockData';
import type { Post as PostType } from '@prisma/client';

// --- Helper Function ---
// THIS FUNCTION IS NOW FIXED
const processCategoryData = (posts: PostType[]) => {
  const categoryCounts: { [key: string]: number } = {};

  // 1. Count all categories from the real data
  for (const post of posts) {
    const category = post.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }

  // Create a lookup map for colors from mockData
  const colorMap = new Map<string, string>();
  for (const detail of categoryDetails) {
    colorMap.set(detail.name, detail.color);
  }
  const defaultColor = '#9ca3af'; // gray-400 for any unknown

  // 2. Build chartData *from the counts*
  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name,
    count: count,
    fill: colorMap.get(name) || defaultColor,
  }));

  // 3. Build chartConfig *from the counts*
  const chartConfig: ChartConfig = {
    count: { label: 'Posts' },
    ...Object.fromEntries(
      Object.keys(categoryCounts).map((name) => [
        name.toLowerCase().replace(/ /g, '-'), // key
        {
          label: name,
          color: colorMap.get(name) || defaultColor, // Look up the color
        },
      ])
    ),
  };

  return { chartData, chartConfig };
};
// --- End Helper Function ---

const Overviewpage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryChartData, setCategoryChartData] = useState<any[]>([]);
  const [categoryChartConfig, setCategoryChartConfig] = useState<ChartConfig>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/posts');
        const data: PostType[] = await response.json();

        setPosts(data);

        const { chartData, chartConfig } = processCategoryData(data);
        setCategoryChartData(chartData);
        setCategoryChartConfig(chartConfig);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    // ... (loading state is the same)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ... (Title section is the same) ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages Collected"
          value={posts.length.toLocaleString()}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* This component will now receive the *complete* data */}
          <CategoryBreakdown
            chartData={categoryChartData}
            chartConfig={categoryChartConfig}
          />

          <TopMessagesCard days={calendarDaysData} messages={topMessagesData} />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <SocialMediaBreakdownCard data={socialMediaCardData} />
          <PlatformInsightsCard insights={platformInsightsData} />
        </div>
      </div>
    </div>
  );
};

export default Overviewpage;
