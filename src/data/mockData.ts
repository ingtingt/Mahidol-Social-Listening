// ... keep your existing interfaces and data
import { Instagram, Twitter, Facebook, LucideIcon } from 'lucide-react';

// This is the shape of our data for the sentiment card
export interface SentimentData {
  totalMessages: number;
  changePercentage: number;
  positive: {
    count: number;
    percentage: number;
  };
  neutral: {
    count: number;
    percentage: number;
  };
  negative: {
    count: number;
    percentage: number;
  };
}

// Here is the actual data, based on your example
export const sentimentData: SentimentData = {
  totalMessages: 177496,
  changePercentage: 24,
  positive: {
    count: 11049,
    percentage: 6.22,
  },
  neutral: {
    count: 161461,
    percentage: 90.97,
  },
  negative: {
    count: 4986,
    percentage: 2.81,
  },
};

export interface SocialMediaChannel {
  name: 'Facebook' | 'Twitter' | 'Instagram';
  value: number;
  percentageChange: number;
  progress: number;
  color: string;
}

export interface SocialMediaCardData {
  totalMessages: number;
  changePercentage: number;
  channels: SocialMediaChannel[];
}

// The actual data for the card
// ... SocialMediaCardData interface is the same

export const socialMediaCardData: SocialMediaCardData = {
  totalMessages: 177496,
  changePercentage: 24,
  channels: [
    // Change the 'color' property to a hex code
    {
      name: 'Facebook',
      value: 14231,
      percentageChange: 72.08,
      progress: 70,
      color: '#3b82f6',
    }, // blue-500
    {
      name: 'Twitter',
      value: 3207,
      percentageChange: 2.13,
      progress: 15,
      color: '#38bdf8',
    }, // sky-400
    {
      name: 'Instagram',
      value: 1084,
      percentageChange: 20.08,
      progress: 15,
      color: '#ec4899',
    }, // pink-500
  ],
};

// New interface for a single platform insight
export interface PlatformInsight {
  platform: string;
  posts: string;
  positive: number;
  neutral: number;
  negative: number;
  Icon: LucideIcon;
}

// The actual data for the card
export const platformInsightsData: PlatformInsight[] = [
  {
    platform: 'Instagram',
    posts: '5,000 Posts',
    positive: 9431,
    neutral: 12314,
    negative: 2314,
    Icon: Instagram,
  },
  {
    platform: 'Twitter',
    posts: '1,000 Posts',
    positive: 2765,
    neutral: 5689,
    negative: 156,
    Icon: Twitter,
  },
  {
    platform: 'Facebook',
    posts: '6,000 Posts',
    positive: 12576,
    neutral: 72567,
    negative: 3651,
    Icon: Facebook,
  },
];

// New interfaces for this card
export interface CalendarDay {
  day: string;
  date: number;
  active?: boolean;
}

export interface TopMessage {
  time: string;
  platform: string;
  message: string;
  images: number;
  imageUrls: string[];
  PlatformIcon: LucideIcon;
}

// Data for the calendar week view
export const calendarDaysData: CalendarDay[] = [
  { day: 'Mon', date: 15 },
  { day: 'Tue', date: 16 },
  { day: 'Wed', date: 17 },
  { day: 'Thu', date: 18 },
  { day: 'Fri', date: 19, active: true },
  { day: 'Sat', date: 20 },
  { day: 'Sun', date: 21 },
];

// Data for the top messages
export const topMessagesData: TopMessage[] = [
  {
    time: '12:00',
    platform: 'Instagram',
    message: 'Receive news and announcements from the college',
    images: 5,
    imageUrls: ['/annocement1.png', '/annocement2.png'],
    PlatformIcon: Instagram,
  },
  {
    time: '12:30',
    platform: 'Facebook',
    message: 'Receive news and announcements from the college',
    images: 5,
    imageUrls: ['/annocement3.png', '/MUICbuilding.png'],
    PlatformIcon: Facebook,
  },
  {
    time: '13:30',
    platform: 'Twitter',
    message: 'Receive news and announcements from the college',
    images: 0,
    imageUrls: [],
    PlatformIcon: Twitter,
  },
  {
    time: '17:00',
    platform: 'Instagram',
    message: 'Receive news and announcements from the college',
    images: 3,
    imageUrls: ['/vza.jpg', '/MUICbuilding2.png'],
    PlatformIcon: Instagram,
  },
  {
    time: '17:00',
    platform: 'Twitter',
    message: 'Receive news and announcements from the college',
    images: 0,
    imageUrls: [],
    PlatformIcon: Twitter,
  },
];

//Keyword Tracker
// New interface for a keyword
export interface Keyword {
  id: number;
  name: string;
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
  type?: string; // Optional type property
}

// Data for the keyword tracker
export const initialKeywords: Keyword[] = [
  {
    id: 1,
    name: 'Mahidol University',
    mentions: 1204,
    positive: 65,
    neutral: 25,
    negative: 10,
  },
  {
    id: 2,
    name: 'MUIC',
    mentions: 987,
    positive: 72,
    neutral: 20,
    negative: 8,
  },
  {
    id: 3,
    name: 'Salaya',
    mentions: 452,
    positive: 50,
    neutral: 45,
    negative: 5,
  },
  {
    id: 4,
    name: 'Admission',
    mentions: 312,
    positive: 40,
    neutral: 50,
    negative: 10,
  },
  {
    id: 5,
    name: 'Graduation',
    mentions: 189,
    positive: 85,
    neutral: 15,
    negative: 0,
  },
];
