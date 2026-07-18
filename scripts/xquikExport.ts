import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

interface CsvRow {
  [key: string]: string;
}

type XquikRow = Record<string, unknown>;

export interface XquikPost {
  id: string;
  content: string;
  createdAt: Date;
  permalink: string;
  reactionsCount: number;
  sharesCount: number;
  commentsCount: number;
  sentiment: string;
  category: string;
}

function isRecord(value: unknown): value is XquikRow {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readString(
  row: XquikRow,
  keys: string[],
  fallback = ''
): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readNumber(row: XquikRow, keys: string[]): number {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.max(0, Math.trunc(value));
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return Math.max(0, Math.trunc(parsed));
    }
  }
  return 0;
}

function rowsFromPayload(payload: unknown): XquikRow[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) return [];

  for (const key of ['data', 'tweets', 'items', 'results']) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isRecord);
  }

  return [];
}

function readRows(filePath: string): XquikRow[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.csv') {
    const result = Papa.parse<CsvRow>(content, {
      header: true,
      skipEmptyLines: true,
    });
    if (result.errors.length > 0) {
      throw new Error(`Could not parse Xquik CSV: ${result.errors[0].message}`);
    }
    return result.data;
  }

  if (extension === '.jsonl' || extension === '.ndjson') {
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const value: unknown = JSON.parse(line);
        if (!isRecord(value)) {
          throw new Error(`Invalid Xquik row at line ${index + 1}.`);
        }
        return value;
      });
  }

  if (extension !== '.json') {
    throw new Error(`Unsupported Xquik export extension: ${extension}`);
  }

  return rowsFromPayload(JSON.parse(content));
}

function toPost(row: XquikRow): XquikPost | null {
  const id = readString(row, ['id', 'tweetId', 'tweet_id']);
  const content = readString(row, ['text', 'content', 'fullText', 'body']);
  const timestamp = readString(row, [
    'createdAt',
    'created_at',
    'createdTime',
    'timestamp',
  ]);
  const createdAt = new Date(timestamp);
  if (!id || !content || !timestamp || Number.isNaN(createdAt.getTime())) {
    return null;
  }

  return {
    id,
    content,
    createdAt,
    permalink: readString(
      row,
      ['url', 'permalink'],
      `https://x.com/i/web/status/${id}`
    ),
    reactionsCount: readNumber(row, ['likeCount', 'like_count', 'likes']),
    sharesCount: readNumber(row, [
      'retweetCount',
      'retweet_count',
      'reposts',
      'retweets',
    ]),
    commentsCount: readNumber(row, [
      'replyCount',
      'reply_count',
      'replies',
    ]),
    sentiment: readString(row, ['sentiment'], 'Neutral'),
    category: readString(row, ['category'], 'Reviewed X Source'),
  };
}

export function readXquikPosts(filePath: string): XquikPost[] {
  return readRows(filePath).map(toPost).filter((post) => post !== null);
}
