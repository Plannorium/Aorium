"use client";

import React, { useState, useEffect } from "react";
import type { AnalysisResult } from "../../prisma/generated/client";
import Card from "../components/ui/Card";
import AnalyticsWidget from "../components/dashboard/AnalyticsWidget";
import AIAssistant from "../components/dashboard/AIAssistant";
import { AnalysisResultsWidget } from "../components/dashboard/AnalysisResultsWidget";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import Button from "../components/ui/Button";
import {
  BarChart2Icon,
  UsersIcon,
  TrendingUpIcon,
  GlobeIcon,
  BellIcon,
  SettingsIcon,
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

// Sample data
const marketTrendData = [
  {
    name: "Jan",
    value: 400,
  },
  {
    name: "Feb",
    value: 300,
  },
  {
    name: "Mar",
    value: 500,
  },
  {
    name: "Apr",
    value: 280,
  },
  {
    name: "May",
    value: 590,
  },
  {
    name: "Jun",
    value: 800,
  },
  {
    name: "Jul",
    value: 810,
  },
];
const regionData = [
  {
    name: "UAE",
    value: 400,
  },
  {
    name: "KSA",
    value: 650,
  },
  {
    name: "Qatar",
    value: 300,
  },
  {
    name: "Kuwait",
    value: 280,
  },
  {
    name: "Bahrain",
    value: 180,
  },
  {
    name: "Oman",
    value: 220,
  },
];
const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalysisResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysisResults(data.results);
    } catch (error) {
      console.error("Failed to fetch analysis results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisResults();
  }, []);
  return (
    <div className="min-h-screen bg-primary-dark py-8">
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-montserrat font-bold text-neutral-light">
                Analytics Dashboard
              </h1>
              <span className="ml-3 px-2 py-0.5 text-xs bg-gold/20 text-[#D4AF37] rounded-md">
                PRO
              </span>
            </div>
            <p className="text-neutral-light/70">
              Welcome back! Here&apos;s your latest insights overview.
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="relative hidden md:block">
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light/50"
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-neutral-light placeholder-neutral-light/50 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-light transition-colors">
                <BellIcon size={20} />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-light transition-colors">
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Dashboard Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="relative">
              <button className="flex items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-neutral-light">
                <span>Last 30 days</span>
                <ChevronDownIcon size={16} className="ml-2" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center">
              <FilterIcon size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <DownloadIcon size={16} className="mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center p-2"
            >
              <RefreshCwIcon size={16} />
            </Button>
          </div>
        </div>
        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsWidget
            title="Total Visitors"
            value="12,456"
            change={{
              value: "12%",
              positive: true,
            }}
            icon={<UsersIcon size={20} />}
          />
          <AnalyticsWidget
            title="Market Growth"
            value="23.5%"
            change={{
              value: "5%",
              positive: true,
            }}
            icon={<TrendingUpIcon size={20} />}
          />
          <AnalyticsWidget
            title="Engagement"
            value="68%"
            change={{
              value: "3%",
              positive: false,
            }}
            icon={<BarChart2Icon size={20} />}
          />
          <AnalyticsWidget
            title="GCC Reach"
            value="6/6"
            change={{
              value: "1",
              positive: true,
            }}
            icon={<GlobeIcon size={20} />}
          />
        </div>
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Trends Chart */}
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-gold">
                    Market Trends
                  </h3>
                  <p className="text-sm text-neutral-light/60 mt-1">
                    Analyze market performance over time
                  </p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1">
                  {["week", "month", "year"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setTimeframe(option)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        timeframe === option
                          ? "bg-gold/20 text-gold"
                          : "text-neutral-light/70 hover:text-neutral-light"
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <LineChart data={marketTrendData} dataKey="value" height={300} />
            </Card>

            {/* AI Analysis Results */}
            <AnalysisResultsWidget results={analysisResults} isLoading={isLoading} onAnalysisComplete={fetchAnalysisResults} />

            {/* Regional Performance */}
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-gold">
                    Regional Performance
                  </h3>
                  <p className="text-sm text-neutral-light/60 mt-1">
                    Compare performance across GCC countries
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <BarChart
                data={regionData}
                dataKey="value"
                height={300}
                color="#90b1d3"
              />
            </Card>
          </div>
          {/* AI Assistant - 1/3 width */}
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
