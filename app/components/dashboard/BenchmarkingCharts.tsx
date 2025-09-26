"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BenchmarkingCharts = ({ brands: analysisResults }) => {
  if (!analysisResults || Object.keys(analysisResults).length === 0) {
    return null;
  }

  const chartData = {
    labels: analysisResults.followerGrowth.map((b) => b.name),
    datasets: [
      {
        label: "Follower Growth",
        data: analysisResults.followerGrowth.map((b) => b.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const engagementData = {
    labels: analysisResults.engagementRate.map((b) => b.name),
    datasets: [
      {
        label: "Engagement Rate",
        data: analysisResults.engagementRate.map((b) => b.value),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const reachData = {
    labels: analysisResults.postReach.map((b) => b.name),
    datasets: [
      {
        label: "Post Reach",
        data: analysisResults.postReach.map((b) => b.value),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const sentimentData = {
    labels: analysisResults.sentiment.positive.map((b) => b.name),
    datasets: [
      {
        label: "Positive",
        data: analysisResults.sentiment.positive.map((b) => b.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Neutral",
        data: analysisResults.sentiment.neutral.map((b) => b.value),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Negative",
        data: analysisResults.sentiment.negative.map((b) => b.value),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Benchmarking Analysis",
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Follower Growth
        </h3>
        <Bar data={chartData} options={options} />
      </div>
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Engagement Rate
        </h3>
        <Bar data={engagementData} options={options} />
      </div>
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Post Reach
        </h3>
        <Bar data={reachData} options={options} />
      </div>
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Sentiment Analysis
        </h3>
        <Bar data={sentimentData} options={options} />
      </div>
    </div>
  );
};

export default BenchmarkingCharts;
