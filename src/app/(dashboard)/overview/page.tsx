'use client'; // This page now fetches data, so it must be a client component

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import {
  Users2,
  MessageSquareText,
  MessageCircleMore,
  BarChart2,
} from 'lucide-react';
import { ChartConfig } from '@/components/ui/chart'; // Import the ChartConfig type

// Import all your components
import CategoryBreakdown from '@/components/CategoryBreakdown';
import TopMessagesCard from '@/components/TopMessagesCard';
// import SocialMediaBreakdownCard from '@/components/SocialMediaBreakdownCard'; // Removed
import PlatformInsightsCard from '@/components/PlatformInsightsCard';
import AddKeywordModal from '@/components/AddKeywordModal';

// Import types and mock data
import {
  platformInsightsData,
  // socialMediaCardData, // Removed
  // calendarDaysData, // No longer needed for TopMessagesCard
  categoryDetails, // We NEED this for colors/labels
} from '@/data/mockData';
import type {
  Post as PostType,
  Keyword,
  Comment,
  Author,
} from '@prisma/client';
import type { ExtractorResults } from '@/data/mockData';
import { useRouter } from 'next/navigation';

type PostWithRelations = PostType & {
  keywords: Keyword[];
  comments: (Comment & { author: Author | null })[];
};

const processCategoryData = (posts: PostWithRelations[]) => {
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
    fill: colorMap.get(name) || defaultColor, // Pass the direct hex code
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
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [mainKeywordMentions, setMainKeywordMentions] = useState(0);
  const [subKeywordMentions, setSubKeywordMentions] = useState(0);
  const [categoryChartData, setCategoryChartData] = useState<any[]>([]);
  const [categoryChartConfig, setCategoryChartConfig] = useState<ChartConfig>(
    {}
  );
  const router = useRouter();

  // State for the "Add Keyword" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordToAdd, setKeywordToAdd] = useState<Partial<Keyword> | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/posts');
        const allPosts: PostWithRelations[] = await response.json();

        setPosts(allPosts);

        // --- 4. CALCULATE STATS ---
        let commentsCount = 0;
        let mainKwCount = 0;
        let subKwCount = 0;

        for (const post of allPosts) {
          // Sum total comments
          commentsCount += post.commentsCount;

          // Count keyword mentions by type
          for (const keyword of post.keywords) {
            if (keyword.type === 'Main') {
              mainKwCount++;
            } else if (keyword.type === 'Sub') {
              subKwCount++;
            }
          }
        }

        // Set all stats
        setTotalPosts(allPosts.length);
        setTotalComments(commentsCount);
        setMainKeywordMentions(mainKwCount);
        setSubKeywordMentions(subKwCount);
        // --- END CALCULATION ---

        const { chartData, chartConfig } = processCategoryData(allPosts);
        setCategoryChartData(chartData);
        setCategoryChartConfig(chartConfig);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Functions for Keyword Extraction Modal ---
  const handleExtractKeywords = (post: PostType) => {
    const dataToStore = {
      content: post.content,
      postId: post.id,
    };
    sessionStorage.setItem('textToExtract', JSON.stringify(dataToStore));
    router.push('/keyword-extractor');
  };

  const handleOpenAddModal = (
    keywordName: string,
    keywordType: 'Main' | 'Sub'
  ) => {
    setKeywordToAdd({
      name: keywordName,
      type: keywordType,
    });
    setIsModalOpen(true);
  };

  const handleSaveFromModal = async (
    keywordData: { name: string; type: string },
    id?: number
  ) => {
    // This function calls your /api/keywords POST route
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keywordData),
      });

      if (response.status === 409) {
        alert(`Keyword "${keywordData.name}" already exists.`);
      } else if (!response.ok) {
        throw new Error('Failed to add keyword');
      } else {
        alert(`Added "${keywordData.name}" to your Keyword Tracker!`);
        setIsModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
      alert(`Could not save keyword "${keywordData.name}".`);
    }
  };
  // --- End Modal Functions ---

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-sm text-gray-500">Page / Overview</p>
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        </div>
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Conditionally render the modal */}
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSaveFromModal}
          keywordToEdit={keywordToAdd as Keyword | null}
        />
      )}

      <div>
        <p className="text-sm text-gray-500">Page / Overview</p>
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={totalPosts.toLocaleString()}
          Icon={Users2}
        />
        <StatCard
          title="Main Keyword Messages"
          value={mainKeywordMentions.toLocaleString()}
          Icon={MessageSquareText}
        />
        <StatCard
          title="Sub-Keyword Messages"
          value={subKeywordMentions.toLocaleString()}
          Icon={MessageCircleMore}
        />
        <StatCard
          title="Total Comments" // This should be (Reactions + Comments + Shares)
          value={totalComments.toLocaleString()} // Temporarily showing total comments
          Icon={BarChart2}
        />
      </div>

      {/* --- NEW LAYOUT --- */}
      <div className="flex flex-col gap-6">
        {/* First Row: Category Breakdown and Platform Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CategoryBreakdown
              chartData={categoryChartData}
              chartConfig={categoryChartConfig}
            />
          </div>
          <div className="lg:col-span-1">
            {/* This component is still using mock data */}
            <PlatformInsightsCard insights={platformInsightsData} />
          </div>
        </div>

        {/* Second Row: Top Messages */}
        <div>
          <TopMessagesCard messages={posts} onExtract={handleExtractKeywords} />
        </div>
      </div>
      {/* --- END NEW LAYOUT --- */}
    </div>
  );
};

export default Overviewpage;
