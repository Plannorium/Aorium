"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { DownloadIcon, FileTextIcon, FileTypeIcon } from "lucide-react";

const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <DownloadIcon size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => handleExport("pdf")}
            >
              <FileTextIcon size={16} className="inline-block mr-2" />
              Export as PDF
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => handleExport("word")}
            >
              <FileTypeIcon size={16} className="inline-block mr-2" />
              Export as Word
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => handleExport("csv")}
            >
              <FileTypeIcon size={16} className="inline-block mr-2" />
              Export as CSV
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
