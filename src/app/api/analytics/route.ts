import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Get all posts
    const posts = await prisma.post.findMany({
      include: { keywords: true },
    });

    // 2. Calculate "Mentions by Category" (for SentimentAreaChart)
    const mentionsByDate: { [key: string]: { [key: string]: number } } = {};
    for (const post of posts) {
      const date = post.createdAt.toISOString().split('T')[0];
      const category = post.category || 'Uncategorized';

      if (!mentionsByDate[date]) {
        mentionsByDate[date] = {};
      }
      if (!mentionsByDate[date][category]) {
        mentionsByDate[date][category] = 0;
      }
      mentionsByDate[date][category]++;
    }
    const analyticData = Object.keys(mentionsByDate).map((date) => ({
      date,
      ...mentionsByDate[date],
    }));

    // 3. Calculate "Platform Performance"
    const platformData: { [key: string]: number } = {};
    for (const post of posts) {
      const platform = post.platform;
      platformData[platform] = (platformData[platform] || 0) + 1;
    }
    const platformPerformance = Object.keys(platformData).map((name) => ({
      name,
      mentions: platformData[name],
    }));

    // 4. Calculate "Top Keywords"
    const keywordData: { [key: string]: number } = {};
    for (const post of posts) {
      for (const keyword of post.keywords) {
        keywordData[keyword.name] = (keywordData[keyword.name] || 0) + 1;
      }
    }
    const topKeywords = Object.keys(keywordData)
      .map((name) => ({ name, mentions: keywordData[name] }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5); // Get top 5

    // 5. Send all stats in one object
    return NextResponse.json({
      analyticData,
      platformPerformance,
      topKeywords,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
