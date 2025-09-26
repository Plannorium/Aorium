export interface BrandData {
  name: string;
  followerGrowth: number;
  engagementRate: number;
  postReach: number;
  audienceDemographics: {
    age: {
      "18-24": number;
      "25-34": number;
      "35-44": number;
      "45-54": number;
      "55-64": number;
      "65+": number;
    };
    gender: {
      male: number;
      female: number;
      other: number;
    };
    topLocations: {
      name: string;
      percentage: number;
    }[];
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
