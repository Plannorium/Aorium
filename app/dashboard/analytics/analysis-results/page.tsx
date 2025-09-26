"use client";
import React, { useState, useEffect } from "react";
import { AnalysisResultsWidget } from "../../../components/dashboard/AnalysisResultsWidget";
import type { AnalysisResult } from "../../../../prisma/generated/client";

const AnalysisResultsPage = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisResultsWidget
        results={analysisResults}
        isLoading={isLoading || filesLoading}
        onAnalysisComplete={fetchAnalysisResults}
        files={files}
        onUploadComplete={fetchFiles}
      />
    </div>
  );
};

export default AnalysisResultsPage;
