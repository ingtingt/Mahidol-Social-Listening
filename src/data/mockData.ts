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
