import Button from "../ui/Button";
import Input from "../ui/input";
import { ArrowRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { OnboardingData } from "./Onboarding";

interface WelcomeScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
}) => {
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    if (onboardingData.businessName) {
      setBusinessName(onboardingData.businessName);
    }
  }, [onboardingData.businessName]);

  const handleNext = () => {
    if (businessName.trim()) {
      updateOnboardingData({ businessName });
      nextStep();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Aorium!</h1>
      <p className="text-lg text-center mb-8">
        Let&lsquo;s get started by setting up your business profile.
      </p>
      <div className="w-full max-w-md">
        <Input
          type="text"
          placeholder="Your Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleNext} className="w-full">
          Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
