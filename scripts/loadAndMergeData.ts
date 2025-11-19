import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// ... (Types are the same) ...
type CsvRow = {
  created_time: string;
  'Predicted Sentiment': string;
};
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
  from: { name?: string; id?: string };
  message: string;
  created_time: string;
  like_count: number;
  reply_count: number;
};

// --- HELPER TO GENERATE RANDOM SENTIMENT ---
function getRandomSentiment() {
  const sentiments = ['Positive', 'Neutral', 'Negative'];
  // Weight it slightly towards Neutral/Positive for realism
  const weights = [0.3, 0.5, 0.2];
  const random = Math.random();

  if (random < weights[0]) return sentiments[0];
  if (random < weights[0] + weights[1]) return sentiments[1];
  return sentiments[2];
}

async function main() {
  console.log('Starting data merge and ingestion script...');

  // 1. Read and parse the CSV file
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
      const jsonStyleTime = row.created_time
        .replace(' ', 'T')
        .replace(/:(\d\d)$/, '$1');
      categoryMap.set(jsonStyleTime, row['Predicted Sentiment']);
    }
  }

  // 2. Read the JSON file
  const jsonFilePath = path.join(process.cwd(), 'facebook_data.json');
  const jsonFileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const jsonData: JsonPost[] = JSON.parse(jsonFileContent);

  console.log(`Found ${jsonData.length} JSON posts to process.`);

  // 3. Loop through JSON data and insert
  for (const post of jsonData) {
    if (!post.content) continue;

    const category = categoryMap.get(post.created_time) || 'Uncategorized';

    try {
      await prisma.post.create({
        data: {
          id: post.post_id,
          platform: 'Facebook',
          content: post.content,
          createdAt: new Date(post.created_time),
          permalink: post.permalink,
          reactionsCount: post.reactions_count || 0,
          sharesCount: post.shares_count || 0,
          commentsCount: post.comments_count || 0,
          category: category,

          // --- ADD FAKE SENTIMENT ---
          sentiment: getRandomSentiment(),
          // --------------------------

          comments: {
            create: post.comments.map((comment: JsonComment) => ({
              id: comment.comment_id,
              message: comment.message,
              createdAt: new Date(comment.created_time),
              likeCount: comment.like_count || 0,
              replyCount: comment.reply_count || 0,

              // --- ADD FAKE SENTIMENT TO COMMENTS TOO ---
              sentiment: getRandomSentiment(),
              category: 'Uncategorized', // Or random category if you want
              // ------------------------------------------

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
      console.log(`Inserted: ${post.post_id}`);
    } catch (e: any) {
      if (e.code !== 'P2002')
        console.error(`Failed: ${post.post_id}`, e.message);
    }
  }

  console.log('Finished.');
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
