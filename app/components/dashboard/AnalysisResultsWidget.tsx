import React, { useState } from "react";
import Card from "../ui/Card";
import type { AnalysisResult } from "../../../prisma/generated/client";
import { AlertTriangle, Info } from "lucide-react";
import Button from "../ui/Button";

interface AnalysisResultsWidgetProps {
  results: AnalysisResult[];
  isLoading: boolean;
  onAnalysisComplete: () => void;
}

const ParsedAnalysisResult: React.FC<{ resultString: string }> = ({
  resultString,
}) => {
  let parsedResult;
  try {
    parsedResult = JSON.parse(resultString);
  } catch (error) {
    // If parsing fails, just display the raw string.
    return (
      <p className="text-neutral-light/80 whitespace-pre-wrap">
        {resultString}
      </p>
    );
  }

  if (parsedResult.status === "success" && parsedResult.analysis) {
    const { analysis } = parsedResult;
    return (
      <div className="prose prose-invert max-w-none">
        <h4 className="text-lg font-semibold text-gold">{analysis.title}</h4>
        <p className="text-neutral-light/80">{analysis.summary}</p>
        {analysis.sections &&
          analysis.sections.map((section: any, index: number) => (
            <div key={index} className="mt-4">
              <h5 className="font-semibold text-neutral-light">
                {section.title}
              </h5>
              <p className="text-neutral-light/70">{section.content}</p>
            </div>
          ))}
      </div>
    );
  }

  if (parsedResult.status === "request_for_data") {
    return (
      <div className="flex items-start space-x-3">
        <Info size={20} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-400">{parsedResult.title}</h4>
          <p className="text-neutral-light/80 mt-1">{parsedResult.message}</p>
          {parsedResult.requiredInfo && (
            <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-light/70">
              {parsedResult.requiredInfo.map((info: string, index: number) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (parsedResult.status === "error") {
    return (
      <div className="flex items-start space-x-3">
        <AlertTriangle size={20} className="text-red-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-red-500">{parsedResult.title}</h4>
          <p className="text-neutral-light/80 mt-1">{parsedResult.message}</p>
          {parsedResult.error && (
            <p className="text-xs text-neutral-light/50 mt-2">
              Details: {parsedResult.error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Fallback for unknown structure or if it's just a string response from before the change
  return (
    <p className="text-neutral-light/80 whitespace-pre-wrap">{resultString}</p>
  );
};

export const AnalysisResultsWidget: React.FC<AnalysisResultsWidgetProps> = ({
  results,
  isLoading,
  onAnalysisComplete,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analytics", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onAnalysisComplete();
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card
      className={`p-6 ${
        !results.length && !isLoading ? "" : "max-h-[60vh]"
      } overflow-y-scroll scrollbar-webkit scrollbar-firefox`}
      hover={true}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-montserrat font-semibold text-xl text-gold">
          AI Analysis Results
        </h3>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || isLoading}>
          {isAnalyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gold"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-light/70">
            No AI analysis results available yet.
          </p>
          <p className="text-sm text-neutral-light/50 mt-2">
            Click "Run Analysis" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => (
            <div key={result.id} className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <p className="text-neutral-light text-sm font-semibold capitalize bg-gold/10 text-gold px-2 py-1 rounded">
                  {result.task.replace(/-/g, " ")}
                </p>
                <p className="text-neutral-light/50 text-xs">
                  {new Date(result.createdAt).toLocaleString()}
                </p>
              </div>

              <ParsedAnalysisResult resultString={result.result} />

              {result.context && (
                <p className="text-neutral-light/60 text-sm mt-3 pt-3 border-t border-white/10">
                  Context: {result.context}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
