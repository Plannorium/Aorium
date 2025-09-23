"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { UploadCloudIcon, X } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

interface FileUploadWidgetProps {
  onUploadComplete: () => void;
  message?: string;
}

const SECTIONS = ["historicalPerformance", "competitor", "data"];

export const FileUploadWidget: React.FC<FileUploadWidgetProps> = ({
  onUploadComplete,
  message,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 3) {
        setError("You can upload a maximum of 3 files.");
        return;
      }
      setFiles([...files, ...newFiles]);
      setError(null);
      setSuccess(null);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    let successCount = 0;
    const uploadErrors: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", selectedSection);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || `Upload failed for ${file.name}.`);
        }
        successCount++;
      } catch (err: any) {
        uploadErrors.push(err.message);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      setSuccess(
        `${successCount} file(s) uploaded successfully! You can now run the analysis.`
      );
      setFiles([]); // Reset file input
      onUploadComplete();
    }

    if (uploadErrors.length > 0) {
      setError(uploadErrors.join("\n"));
    }
  };

  return (
    <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
      {message && <p className="text-neutral-light/80 mb-4">{message}</p>}
      <UploadCloudIcon className="mx-auto h-12 w-12 text-neutral-light/50" />
      <h3 className="mt-2 text-lg font-medium text-neutral-light">
        Upload your data
      </h3>
      <p className="mt-1 text-sm text-neutral-light/60">
        Upload up to 3 files for Financials, Marketing, and Sales to enable
        analysis.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
          <CustomSelect
            options={SECTIONS}
            value={selectedSection}
            onChange={setSelectedSection}
          />
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-neutral-light whitespace-nowrap"
            >
              Choose Files
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 w-full max-w-sm">
            <p className="text-sm font-medium text-neutral-light/80 mb-2">
              Selected files:
            </p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-left"
                >
                  <span className="text-sm text-neutral-light truncate pr-2">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-400 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading || files.length === 0}
          className="mt-2"
        >
          {isUploading ? "Uploading..." : `Upload ${files.length} File(s)`}
        </Button>
      </form>
      {error && (
        <p className="mt-4 text-sm text-red-500 whitespace-pre-line">{error}</p>
      )}
      {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
    </div>
  );
};
