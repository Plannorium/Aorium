"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import WelcomeScreen from "../components/onboarding/WelcomeScreen";
import BusinessTypeScreen from "../components/onboarding/BusinessTypeScreen";
import BusinessContextScreen from "../components/onboarding/BusinessContextScreen";
import GoalSelectionScreen from "../components/onboarding/GoalSelectionScreen";
import MarketingContentScreen from "../components/onboarding/MarketingContentScreen";
import DataSpecificsAndUploadScreen from "../components/onboarding/DataSpecificsAndUploadScreen";
import PreviewScreen from "../components/onboarding/PreviewScreen";
import Modal from "../components/Modal";

export interface UploadedFileMetadata {
  original_filename: string;
  size: number;
  url: string;
  publicId: string;
  mime: string;
  section: string;
}

export type OnboardingData = {
  businessName: string;
  businessType: string;
  businessSize: string;
  region: string;
  goals: string[];
  uploadedFiles: UploadedFileMetadata[];
  competitors: string;
  targetAudience: string;
  industryChallenges: string;
  contentFocus: string[];
  preferredPlatforms: string[];
  contentKPIs: string[];
};

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: "",
    businessType: "",
    businessSize: "",
    region: "",
    goals: [],
    uploadedFiles: [],
    competitors: "",
    targetAudience: "",
    industryChallenges: "",
    contentFocus: [],
    preferredPlatforms: [],
    contentKPIs: [],
  });

  const router = useRouter();

  const updateOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) {
        // try to parse server error JSON for a friendly message
        let errMsg = `HTTP error! status: ${response.status}`;
        try {
          const errBody = await response.json();
          errMsg = errBody?.message || errBody?.error || errMsg;
        } catch {
          // ignore JSON parse errors
        }
        setErrorMessage(errMsg);
        return;
      }

      const result = await response.json();
      console.log("Onboarding successful:", result);
      // show the success banner for 2s, then navigate
      setShowSuccessMessage(true);
      setTimeout(() => {
        setOnboardingComplete(true);
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Onboarding failed:", error);
      setErrorMessage(
        (error as Error)?.message || "Onboarding failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <BusinessTypeScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <BusinessContextScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <GoalSelectionScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <MarketingContentScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <DataSpecificsAndUploadScreen
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <PreviewScreen
            onboardingData={onboardingData}
            prevStep={prevStep}
            completeOnboarding={completeOnboarding}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (onboardingComplete) {
      router.push("/dashboard");
    }
  }, [onboardingComplete, router]);

  return (
    <OnboardingLayout currentStep={currentStep}>
      <Modal
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        title="Onboarding Complete!"
        height=""
      >
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <p className="text-lg text-white mt-4">
            You will be redirected to your dashboard shortly.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-green-500 h-2.5 rounded-full animate-pulse"></div>
          </div>
        </div>
      </Modal>

      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-[#1A1A1A] border border-[#FFD700]/30 p-10 rounded-xl shadow-2xl text-center max-w-md mx-auto transform scale-95 opacity-0 animate-scale-in">
            <div className="flex flex-col items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-[#FFD700] mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-[#FFD700] font-montserrat text-3xl font-bold">
                Error
              </h2>
            </div>
            <p className="text-[#F8F9FA] text-lg mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              className="bg-[#FFD700] text-[#1A1A1A] font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 ease-in-out shadow-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingFlow;
