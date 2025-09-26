"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart2Icon,
  GlobeIcon,
  TrendingUpIcon,
  UsersIcon,
  BrainCircuitIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/input";
import { mockBrandData } from "../../data/mockBenchmarkingData";
import BenchmarkingCharts from "./BenchmarkingCharts";
import Spinner from "../ui/Spinner";
import ExportDropdown from "./ExportDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const BenchmarkingWidget = () => {
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [compareBrandA, setCompareBrandA] = useState("");
  const [compareBrandB, setCompareBrandB] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedCompetitors, setSuggestedCompetitors] = useState<string[]>(
    []
  );
  const [showBrandComparison, setShowBrandComparison] = useState(false);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        const res = await fetch("/api/onboarding");
        if (res.ok) {
          const data = await res.json();
          if (data.onboarding && data.onboarding.competitors) {
            setSuggestedCompetitors(
              data.onboarding.competitors
                .split(",")
                .map((c: string) => c.trim())
            );
          }
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
      }
    };
    fetchOnboardingData();
  }, []);

  const handleAddCompetitor = (competitorName: string) => {
    if (competitorName.trim() && !competitors.includes(competitorName.trim())) {
      setCompetitors([...competitors, competitorName.trim()]);
      setNewCompetitor("");
    }
  };

  const handleCompareCompetitor = async (competitorName: string) => {
    setIsLoading(true);
    setAnalysisResults(null);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Analyze competitor: ${competitorName}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResults(data);
      }
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCompetitor = (competitorToRemove: string) => {
    setCompetitors(competitors.filter((c) => c !== competitorToRemove));
  };

  const handleCompare = async () => {
    if (compareBrandA.trim() && compareBrandB.trim()) {
      setIsLoading(true);
      setAnalysisResults(null);
      try {
        const res = await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `Compare ${compareBrandA.trim()} and ${compareBrandB.trim()}`,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAnalysisResults(data);
        }
      } catch (error) {
        console.error("Error triggering comparison:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = async (format: "pdf" | "word" | "csv") => {
    if (!analysisResults) return;

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("Benchmarking Analysis", 14, 16);
      const tableData = Object.entries(analysisResults).flatMap(
        ([key, value]) => {
          if (key === "sentiment") {
            return Object.entries(value).map(
              ([sentimentKey, sentimentValue]) => [
                `Sentiment - ${sentimentKey}`,
                ...sentimentValue.map((v) => v.value),
              ]
            );
          } else {
            return [[key, ...value.map((v) => v.value)]];
          }
        }
      );

      autoTable(doc, {
        head: [
          ["Metric", ...analysisResults.followerGrowth.map((b) => b.name)],
        ],
        body: tableData,
        startY: 20,
      });
      doc.save("benchmarking-analysis.pdf");
    } else if (format === "word") {
      const htmlString = `
        <h1>Benchmarking Analysis</h1>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              ${analysisResults.followerGrowth
                .map((b) => `<th>${b.name}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(analysisResults)
              .map(([key, value]) => {
                if (key === "sentiment") {
                  return Object.entries(value)
                    .map(
                      ([sentimentKey, sentimentValue]) => `
                      <tr>
                        <td>Sentiment - ${sentimentKey}</td>
                        ${sentimentValue
                          .map((v) => `<td>${v.value}</td>`)
                          .join("")}
                      </tr>
                    `
                    )
                    .join("");
                } else {
                  return `
                    <tr>
                      <td>${key}</td>
                      ${value.map((v) => `<td>${v.value}</td>`).join("")}
                    </tr>
                  `;
                }
              })
              .join("")}
          </tbody>
        </table>
      `;

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlString }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "benchmarking-analysis.docx";
        a.click();
      } else {
        console.error("Error exporting to Word");
      }
    } else if (format === "csv") {
      const csvData = Object.entries(analysisResults).flatMap(
        ([key, value]) => {
          if (key === "sentiment") {
            return Object.entries(value).map(
              ([sentimentKey, sentimentValue]) => ({
                Metric: `Sentiment - ${sentimentKey}`,
                ...sentimentValue.reduce(
                  (acc, v) => ({ ...acc, [v.name]: v.value }),
                  {}
                ),
              })
            );
          } else {
            return {
              Metric: key,
              ...value.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {}),
            };
          }
        }
      );

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "benchmarking-analysis.csv";
      a.click();
    }
  };

  const filteredData = mockBrandData.filter(
    (brand) => brand.name === "Your Brand" || competitors.includes(brand.name)
  );

  return (
    <div className="bg-neutral-light p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-text-dark">Benchmarking</h2>
          <p className="text-gray-600">
            Compare your performance against industry benchmarks and
            competitors.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {/* Competitor Input Section */}
      <div className="mb-6 max-w-xl">
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Competitor Analysis
        </h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter a competitor's brand name"
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            className="flex-grow"
          />
          <Button
            variant="secondary"
            onClick={() => handleAddCompetitor(newCompetitor)}
            disabled={!newCompetitor.trim()}
          >
            <PlusIcon size={16} className="mr-2" />
            Add
          </Button>
        </div>
        {suggestedCompetitors.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Suggestions:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {suggestedCompetitors.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCompetitor(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        {competitors.length > 0 && (
          <div className="mt-4 space-y-2">
            {competitors.map((competitor) => (
              <div
                key={competitor}
                className="flex items-center justify-between bg-background p-2 rounded-md"
              >
                <span className="text-text-dark">{competitor}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCompareCompetitor(competitor)}
                  >
                    Compare
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCompetitor(competitor)}
                  >
                    <Trash2Icon size={16} className="text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Section */}
      <div className="mb-6">
        <button
          className="text-sm text-primary-DEFAULT hover:underline"
          onClick={() => setShowBrandComparison(!showBrandComparison)}
        >
          {showBrandComparison ? "Hide" : "Compare Other Brands"}
        </button>
        <>
          {showBrandComparison && (
            <div className="mt-4 flex gap-2">
              <Input
                type="text"
                placeholder="Brand A"
                value={compareBrandA}
                onChange={(e) => setCompareBrandA(e.target.value)}
                className="flex-grow"
              />
              <Input
                type="text"
                placeholder="Brand B"
                value={compareBrandB}
                onChange={(e) => setCompareBrandB(e.target.value)}
                className="flex-grow"
              />
              <Button variant="secondary" onClick={handleCompare}>
                Compare
              </Button>
            </div>
          )}
        </>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-6">
          <Spinner />
        </div>
      )}
      {analysisResults && <BenchmarkingCharts brands={analysisResults} />}
    </div>
  );
};

export default BenchmarkingWidget;
