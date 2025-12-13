import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// 1. Define the shape of your CSV data
interface CsvRow {
  id: string; // The Post ID or Comment ID
  sentiment: string; // "Positive", "Neutral", "Negative"
  category: string; // "Inquiry", "Complaint", etc.
}

async function main() {
  console.log('Starting data merge and ingestion script...');

  // --- STEP A: Read the Real Labels from CSV ---
  const csvFilePath = path.join(
    process.cwd(),
    'merged_facebook_sentiment_results.csv'
  );
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

  // Parse CSV
  const parsedCsv = Papa.parse<CsvRow>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Create a "Lookup Map" for fast searching
  // Map Key = ID, Map Value = { sentiment, category }
  const labelMap = new Map<string, { sentiment: string; category: string }>();

  parsedCsv.data.forEach((row) => {
    if (row.id) {
      // Normalize sentiment (First letter uppercase, rest lowercase)
      const cleanSentiment = row.sentiment
        ? row.sentiment.charAt(0).toUpperCase() +
          row.sentiment.slice(1).toLowerCase()
        : 'Neutral';

      const cleanCategory = row.category || 'Uncategorized';

      labelMap.set(row.id, {
        sentiment: cleanSentiment,
        category: cleanCategory,
      });
    }
  });

  console.log(`Loaded ${labelMap.size} labels from CSV.`);

  // --- STEP B: Read the JSON Data ---
  const jsonFilePath = path.join(process.cwd(), 'facebook_data.json');
  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  const posts = JSON.parse(rawData);

  console.log(`Found ${posts.length} JSON posts to process.`);

  // --- STEP C: Insert into Database ---
  for (const post of posts) {
    try {
      // 1. Look up Post Labels
      const postLabels = labelMap.get(post.post_id) || {
        sentiment: 'Neutral',
        category: 'Uncategorized',
      };

      await prisma.post.create({
        data: {
          id: post.post_id,
          platform: 'Facebook',
          content: post.message || '[No Content]',
          createdAt: new Date(post.created_time),
          permalink: post.permalink_url,
          reactionsCount: post.reactions?.summary?.total_count || 0,
          sharesCount: post.shares?.count || 0,
          commentsCount: post.comments?.summary?.total_count || 0,

          // USE REAL DATA HERE
          sentiment: postLabels.sentiment,
          category: postLabels.category,
        },
      });

      // 2. Process Comments
      if (post.comments && post.comments.data) {
        for (const comment of post.comments.data) {
          // Look up Comment Labels
          const commentLabels = labelMap.get(comment.id) || {
            sentiment: 'Neutral',
            category: 'Uncategorized',
          };

          await prisma.comment.create({
            data: {
              id: comment.id,
              message: comment.message,
              createdAt: new Date(comment.created_time),
              likeCount: comment.like_count || 0,
              replyCount: comment.comment_count || 0,
              postId: post.post_id,

              // USE REAL DATA HERE
              sentiment: commentLabels.sentiment,
              category: commentLabels.category,

              author: {
                connectOrCreate: {
                  where: { id: comment.from.id },
                  create: {
                    id: comment.from.id,
                    name: comment.from.name,
                  },
                },
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(`Skipping duplicate or error for post ${post.post_id}`);
    }
  }

  console.log('Data ingestion finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
