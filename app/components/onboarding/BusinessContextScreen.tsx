import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { OnboardingData } from "../../onboarding/page";

interface BusinessContextScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const BusinessContextScreen: React.FC<BusinessContextScreenProps> = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
  prevStep,
}) => {
  const [competitors, setCompetitors] = useState(
    onboardingData.competitors || ""
  );
  const [targetAudience, setTargetAudience] = useState(
    onboardingData.targetAudience || ""
  );
  const [industryChallenges, setIndustryChallenges] = useState(
    onboardingData.industryChallenges || ""
  );
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCompetitors(onboardingData.competitors || "");
    setTargetAudience(onboardingData.targetAudience || "");
    setIndustryChallenges(onboardingData.industryChallenges || "");
  }, [onboardingData]);

  const handleContinue = () => {
    setFormError("");
    if (!competitors || !targetAudience || !industryChallenges) {
      setFormError("Please answer all questions.");
      return;
    }
    updateOnboardingData({
      competitors,
      targetAudience,
      industryChallenges,
    });
    nextStep();
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-montserrat font-semibold text-gold mb-6">
        Tell us more about your business context
      </h1>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="competitors"
            className="block text-neutral-light text-sm font-medium mb-2"
          >
            List your top 3 competitors (if known):
          </label>
          <input
            type="text"
            id="competitors"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            className="w-full p-3 rounded-lg bg-secondary border border-white/10 focus:border-gold focus:ring-gold"
            placeholder="Competitor A, Competitor B, Competitor C"
          />
        </div>
        <div>
          <label
            htmlFor="targetAudience"
            className="block text-neutral-light text-sm font-medium mb-2"
          >
            Who is your main customer segment? (B2B, B2C, both):
          </label>
          <input
            type="text"
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-3 rounded-lg bg-secondary border border-white/10 focus:border-gold focus:ring-gold"
            placeholder="B2B, B2C, or both"
          />
        </div>
        <div>
          <label
            htmlFor="industryChallenges"
            className="block text-neutral-light text-sm font-medium mb-2"
          >
            What is your biggest challenge right now? (Growth, engagement,
            conversion, retention):
          </label>
          <input
            type="text"
            id="industryChallenges"
            value={industryChallenges}
            onChange={(e) => setIndustryChallenges(e.target.value)}
            className="w-full p-3 rounded-lg bg-secondary border border-white/10 focus:border-gold focus:ring-gold"
            placeholder="Growth, engagement, conversion, retention"
          />
        </div>
      </div>
      {formError && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mt-6">
          {formError}
        </div>
      )}
      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="outline">
          <ArrowLeftIcon size={16} className="mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
          <ArrowRightIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default BusinessContextScreen;
