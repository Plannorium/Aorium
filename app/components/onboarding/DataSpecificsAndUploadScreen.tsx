import React, { useState, useCallback, useEffect } from "react";
import Button from "../ui/Button";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { OnboardingData, UploadedFileMetadata } from "../../onboarding/page";
import { useDropzone } from "react-dropzone";

interface DataSpecificsAndUploadScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const DataSpecificsAndUploadScreen: React.FC<
  DataSpecificsAndUploadScreenProps
> = ({ onboardingData, updateOnboardingData, nextStep, prevStep }) => {
  const [competitorDataFiles, setCompetitorDataFiles] = useState<File[]>([]);
  const [historicalPerformanceFiles, setHistoricalPerformanceFiles] = useState<
    File[]
  >([]);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize files from onboardingData if they were previously uploaded
    // For now, we'll assume files are handled on a per-session basis or re-uploaded.
  }, [onboardingData]);

  const onDropCompetitorData = useCallback(
    (acceptedFiles: File[]) => {
      if (competitorDataFiles.length + acceptedFiles.length > 3) {
        setFormError("You can upload a maximum of 3 competitor data files.");
        return;
      }
      setCompetitorDataFiles((prev) => [...prev, ...acceptedFiles]);
      setFormError("");
    },
    [competitorDataFiles]
  );

  const onDropHistoricalPerformance = useCallback(
    (acceptedFiles: File[]) => {
      if (historicalPerformanceFiles.length + acceptedFiles.length > 3) {
        setFormError(
          "You can upload a maximum of 3 historical performance files."
        );
        return;
      }
      setHistoricalPerformanceFiles((prev) => [...prev, ...acceptedFiles]);
      setFormError("");
    },
    [historicalPerformanceFiles]
  );

  const onDropDataFiles = useCallback(
    (acceptedFiles: File[]) => {
      if (dataFiles.length + acceptedFiles.length > 5) {
        setFormError("You can upload a maximum of 5 data files.");
        return;
      }
      setDataFiles((prev) => [...prev, ...acceptedFiles]);
      setFormError("");
    },
    [dataFiles]
  );

  const {
    getRootProps: getCompetitorRootProps,
    getInputProps: getCompetitorInputProps,
  } = useDropzone({
    onDrop: onDropCompetitorData,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 3 - competitorDataFiles.length,
  });

  const {
    getRootProps: getHistoricalRootProps,
    getInputProps: getHistoricalInputProps,
  } = useDropzone({
    onDrop: onDropHistoricalPerformance,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 3 - historicalPerformanceFiles.length,
  });

  const { getRootProps: getDataRootProps, getInputProps: getDataInputProps } =
    useDropzone({
      onDrop: onDropDataFiles,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "application/vnd.ms-excel": [".xls"],
        "text/csv": [".csv"],
      },
      maxFiles: 5 - dataFiles.length,
    });

  const removeFile = (
    fileToRemove: File,
    setter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setter((prev) => prev.filter((file) => file !== fileToRemove));
    setFormError("");
  };

  const handleContinue = () => {
    setFormError("");
    setIsLoading(true);
    const uploadFiles = async () => {
      const allFiles = [
        ...competitorDataFiles.map((file) => ({
          file,
          section: "competitorData",
        })),
        ...historicalPerformanceFiles.map((file) => ({
          file,
          section: "historicalPerformance",
        })),
        ...dataFiles.map((file) => ({ file, section: "dataFiles" })),
      ];

      const uploadedMetadata: UploadedFileMetadata[] = [];
      for (const { file, section } of allFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", section);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "File upload failed");
          }

          const result = await response.json();
          uploadedMetadata.push({
            original_filename: result.file.original_filename,
            size: result.file.size,
            url: result.file.url,
            publicId: result.file.public_id,
            mime: result.file.format,
            section: section,
          });
        } catch (error: any) {
          console.error("Error uploading file:", file.name, error);
          setFormError(`Failed to upload ${file.name}: ${error.message}`);
          return; // Stop processing if any file fails to upload
        }
      }

      updateOnboardingData({
        uploadedFiles: uploadedMetadata,
      });
      setIsLoading(false);
      nextStep();
    };

    uploadFiles();
  };

  useEffect(() => {
    if (formError) {
      setIsLoading(false);
    }
  }, [formError]);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-montserrat font-semibold text-gold mb-6">
        Data Specifics & Upload
      </h1>
      <div className="space-y-8">
        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            Do you have competitor reports or data you’d like to upload? (PDF,
            Excel, CSV)
          </label>
          <div
            {...getCompetitorRootProps()}
            className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 text-center hover:border-white/50 transition-colors cursor-pointer"
          >
            <input {...getCompetitorInputProps()} />
            <div>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-neutral-light" />
              <p className="mt-4 text-sm text-neutral-light">
                <span className="font-semibold">Drag and drop</span> files here,
                or <span className="text-gold">click to browse</span>
              </p>
              <p className="text-xs leading-5 text-neutral-light mt-1">
                Up to 3 files (PDF, Excel, CSV)
              </p>
            </div>
          </div>
          <div className="mt-4">
            {competitorDataFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between bg-neutral-dark p-2 rounded-md mb-2"
              >
                <span className="text-sm text-neutral-light">{file.name}</span>
                <button
                  onClick={() => removeFile(file, setCompetitorDataFiles)}
                  className="text-red-400 hover:text-red-600"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            Do you have past performance data (sales, ad reports, engagement
            metrics)? (PDF, Excel, CSV)
          </label>
          <div
            {...getHistoricalRootProps()}
            className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 text-center hover:border-white/50 transition-colors cursor-pointer"
          >
            <input {...getHistoricalInputProps()} />
            <div>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-neutral-light" />
              <p className="mt-4 text-sm text-neutral-light">
                <span className="font-semibold">Drag and drop</span> files here,
                or <span className="text-gold">click to browse</span>
              </p>
              <p className="text-xs leading-5 text-neutral-light mt-1">
                Up to 3 files (PDF, Excel, CSV)
              </p>
            </div>
          </div>
          <div className="mt-4">
            {historicalPerformanceFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between bg-neutral-dark p-2 rounded-md mb-2"
              >
                <span className="text-sm text-neutral-light">{file.name}</span>
                <button
                  onClick={() =>
                    removeFile(file, setHistoricalPerformanceFiles)
                  }
                  className="text-red-400 hover:text-red-600"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            Upload any other relevant business data (PDF, Excel, CSV)
          </label>
          <div
            {...getDataRootProps()}
            className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 text-center hover:border-white/50 transition-colors cursor-pointer"
          >
            <input {...getDataInputProps()} />
            <div>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-neutral-light" />
              <p className="mt-4 text-sm text-neutral-light">
                <span className="font-semibold">Drag and drop</span> files here,
                or <span className="text-gold">click to browse</span>
              </p>
              <p className="text-xs leading-5 text-neutral-light mt-1">
                Up to 5 files (PDF, Excel, CSV)
              </p>
            </div>
          </div>
          <div className="mt-4">
            {dataFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between bg-neutral-dark p-2 rounded-md mb-2"
              >
                <span className="text-sm text-neutral-light">{file.name}</span>
                <button
                  onClick={() => removeFile(file, setDataFiles)}
                  className="text-red-400 hover:text-red-600"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {formError && (
        <p className="text-red-500 text-sm mt-4 text-center">{formError}</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button onClick={prevStep} variant="secondary" disabled={isLoading}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleContinue} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Continue"}{" "}
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSpecificsAndUploadScreen;
