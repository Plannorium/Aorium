"use client";

import React, { useState, useEffect } from "react";
import type { AnalysisResult } from "../../prisma/generated/client";
import Card from "../components/ui/Card";
import AIAssistant from "../components/dashboard/AIAssistant";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import Link from "next/link";
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
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [marketTrendData, setMarketTrendData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const router = useRouter();

  const fetchAnalysisResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysisResults(data.results);
      setUser(data.user);
      setRegionData(data.regionData);
    } catch (error) {
      console.error("Failed to fetch analysis results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await fetch("/api/upload");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisResults();
    fetchFiles();
  }, []);

  useEffect(() => {
    if (user && user.onboarding) {
      const goals = user.onboarding.goals || [];
      const newMarketTrendData = goals.map((goal: string, index: number) => ({
        name: goal,
        value: (index + 1) * 100,
      }));
      setMarketTrendData(newMarketTrendData);
    }
  }, [user]);
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
              {/* <span className="ml-3 px-2 py-0.5 text-xs bg-gold/20 text-[#D4AF37] rounded-md">
                PRO
              </span> */}
            </div>
            <p className="text-neutral-light/70">
              Welcome back! Here&apos;s your latest insights overview.
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-light transition-colors">
                <BellIcon size={20} />
              </button>
              <button
                onClick={() => router.push("/user")}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-light transition-colors cursor-pointer"
              >
                <SettingsIcon size={20} />
              </button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center p-2 cursor-pointer"
                onClick={() => {
                  fetchAnalysisResults();
                  fetchFiles();
                }}
              >
                <RefreshCwIcon size={16} />
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
        {/* Benchmarking and Social Performance Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <Card className="p-6" hover={true}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
                  Benchmarking
                </h3>
                <p className="text-sm text-neutral-light/60 mt-1">
                  Compare your performance against industry benchmarks and
                  competitors.
                </p>
              </div>
              <Link href="/dashboard/analytics/benchmarking">
                <Button className="cursor-pointer" variant="outline" size="sm">
                  Benchmarking
                </Button>
              </Link>
            </div>
          </Card>
          {/* Social Performance Widget */}
          <Card className="p-6" hover={true}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
                  Social Performance
                </h3>
                <p className="text-sm text-neutral-light/60 mt-1">
                  Track your social media performance metrics.
                </p>
              </div>
              <Link href="/dashboard/social-performance">
                <Button className="cursor-pointer" variant="outline" size="sm">
                  View Social Performance
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Trends Chart */}
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
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
                          ? "bg-gold/20 text-[#D4AF37]"
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

            {/* Regional Performance */}
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
                    Regional Performance
                  </h3>
                  <p className="text-sm text-neutral-light/60 mt-1">
                    Compare performance across GCC countries
                  </p>
                </div>
                <Button className="cursor-pointer" variant="outline" size="sm">
                  Explore Regions
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
          {/* Side Widgets - Full width */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
                    Market News
                  </h3>
                  <p className="text-sm text-neutral-light/60 mt-1">
                    Stay up to date with the latest market news.
                  </p>
                </div>
                <Link href="/dashboard/analytics/market-news">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                  >
                    Read News
                  </Button>
                </Link>
              </div>
            </Card>
            <Card className="p-6" hover={true}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-[#D4AF37]">
                    Analysis Results
                  </h3>
                  <p className="text-sm text-neutral-light/60 mt-1">
                    View your latest analysis results.
                  </p>
                </div>
                <Link href="/dashboard/analytics/analysis-results">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                  >
                    View Results
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
