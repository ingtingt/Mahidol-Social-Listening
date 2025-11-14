import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse'; // Make sure you've run: npm install papaparse @types/papaparse

const prisma = new PrismaClient();

// Type for the (bad) CSV row
type CsvRow = {
  created_time: string;
  'Predicted Sentiment': string;
  // Add other CSV columns if needed, but these are the minimum
  post_id: string;
  content: string;
  permalink: string;
  reactions_count: string;
  shares_count: string;
  comments_count: string;
  comments: string;
};

// Types for the (good) JSON data
type JsonPost = {
  post_id: string;
  content: string;
  created_time: string;
  permalink: string;
  reactions_count: number;
  shares_count: number;
  comments_count: number;
  comments: JsonComment[];
};

type JsonComment = {
  comment_id: string;
  from: {
    name?: string;
    id?: string;
  };
  message: string;
  created_time: string;
  like_count: number;
  reply_count: number;
};

async function main() {
  console.log('Starting data merge and ingestion script...');

  // 1. Read and parse the CSV file to create a category lookup map
  const csvFilePath = path.join(
    process.cwd(),
    'merged_facebook_sentiment_results.csv'
  );
  const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const parseResult = Papa.parse<CsvRow>(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const categoryMap = new Map<string, string>();
  for (const row of parseResult.data) {
    if (row.created_time && row['Predicted Sentiment']) {
      // THE FIX IS HERE:
      // This converts the CSV time string to match the JSON time string
      // CSV:  "2025-11-03 12:51:15+00:00"
      // JSON: "2025-11-03T12:51:15+0000"
      const jsonStyleTime = row.created_time
        .replace(' ', 'T') // Replaces the space with a 'T'
        .replace(/:(\d\d)$/, '$1'); // Removes the last colon (e.g., +00:00 -> +0000)

      categoryMap.set(jsonStyleTime, row['Predicted Sentiment']);
    }
  }
  console.log(`Created category lookup map with ${categoryMap.size} entries.`);

  // 2. Read the JSON file
  const jsonFilePath = path.join(process.cwd(), 'facebook_data.json');
  const jsonFileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const jsonData: JsonPost[] = JSON.parse(jsonFileContent);

  console.log(`Found ${jsonData.length} JSON posts to process.`);

  // 3. Loop through JSON data, merge with category, and insert
  for (const post of jsonData) {
    if (!post.content) {
      console.log(`Skipping post ${post.post_id} due to empty content.`);
      continue;
    }

    // Find the category from our map using the JSON time string
    const category = categoryMap.get(post.created_time) || 'Uncategorized'; // Default category if not found

    if (category === 'Uncategorized') {
      console.warn(
        `Warning: Could not find category for post ${post.post_id}, defaulting to 'Uncategorized'.`
      );
    }

    try {
      await prisma.post.create({
        data: {
          id: post.post_id, // Use the *correct* ID from the JSON
          platform: 'Facebook',
          content: post.content,
          createdAt: new Date(post.created_time),
          permalink: post.permalink,
          reactionsCount: post.reactions_count || 0,
          sharesCount: post.shares_count || 0,
          commentsCount: post.comments_count || 0,
          category: category, // Use the matched category

          // Create all comments and authors from the JSON
          comments: {
            create: post.comments.map((comment: JsonComment) => ({
              id: comment.comment_id,
              message: comment.message,
              createdAt: new Date(comment.created_time),
              likeCount: comment.like_count || 0,
              replyCount: comment.reply_count || 0,

              author:
                comment.from && comment.from.id
                  ? {
                      connectOrCreate: {
                        where: { id: comment.from.id },
                        create: {
                          id: comment.from.id,
                          name: comment.from.name || 'Unknown User',
                        },
                      },
                    }
                  : undefined,
            })),
          },
        },
      });
      console.log(
        `Successfully inserted post: ${post.post_id} with category: ${category}`
      );
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.log(`Skipping duplicate post: ${post.post_id}`);
      } else {
        console.error(`Failed to insert post ${post.post_id}:`, e.message);
      }
    }
  }

  console.log('Data merge and ingestion finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
