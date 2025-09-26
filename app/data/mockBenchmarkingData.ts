import { BrandData } from "../types/benchmarking";

export const mockBrandData: BrandData[] = [
  {
    name: "Your Brand",
    followerGrowth: 1500,
    engagementRate: 0.035,
    postReach: 25000,
    audienceDemographics: {
      age: {
        "18-24": 0.25,
        "25-34": 0.35,
        "35-44": 0.2,
        "45-54": 0.1,
        "55-64": 0.05,
        "65+": 0.05,
      },
      gender: {
        male: 0.4,
        female: 0.55,
        other: 0.05,
      },
      topLocations: [
        { name: "New York, USA", percentage: 0.3 },
        { name: "London, UK", percentage: 0.2 },
        { name: "Sydney, AU", percentage: 0.15 },
      ],
    },
    sentiment: {
      positive: 0.7,
      neutral: 0.2,
      negative: 0.1,
    },
  },
  {
    name: "Competitor A",
    followerGrowth: 1200,
    engagementRate: 0.028,
    postReach: 22000,
    audienceDemographics: {
      age: {
        "18-24": 0.3,
        "25-34": 0.4,
        "35-44": 0.15,
        "45-54": 0.08,
        "55-64": 0.04,
        "65+": 0.03,
      },
      gender: {
        male: 0.45,
        female: 0.5,
        other: 0.05,
      },
      topLocations: [
        { name: "Los Angeles, USA", percentage: 0.25 },
        { name: "Toronto, CA", percentage: 0.2 },
        { name: "Melbourne, AU", percentage: 0.1 },
      ],
    },
    sentiment: {
      positive: 0.65,
      neutral: 0.25,
      negative: 0.1,
    },
  },
  {
    name: "Competitor B",
    followerGrowth: 2000,
    engagementRate: 0.042,
    postReach: 30000,
    audienceDemographics: {
      age: {
        "18-24": 0.2,
        "25-34": 0.3,
        "35-44": 0.25,
        "45-54": 0.15,
        "55-64": 0.05,
        "65+": 0.05,
      },
      gender: {
        male: 0.35,
        female: 0.6,
        other: 0.05,
      },
      topLocations: [
        { name: "Chicago, USA", percentage: 0.2 },
        { name: "Vancouver, CA", percentage: 0.15 },
        { name: "London, UK", percentage: 0.1 },
      ],
    },
    sentiment: {
      positive: 0.75,
      neutral: 0.15,
      negative: 0.1,
    },
  },
];
