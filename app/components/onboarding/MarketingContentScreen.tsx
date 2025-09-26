import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon } from "lucide-react";
import { OnboardingData } from "../../onboarding/page";

interface MarketingContentScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const contentFocusOptions = [
  { id: "social_media", name: "Social media posts" },
  { id: "blog_articles", name: "Blog articles" },
  { id: "videos", name: "Videos" },
  { id: "product_descriptions", name: "Product descriptions" },
];

const preferredPlatformsOptions = [
  { id: "instagram", name: "Instagram" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "tiktok", name: "TikTok" },
  { id: "website", name: "Website" },
  { id: "others", name: "Others" },
];

const contentKPIsOptions = [
  { id: "reach", name: "Reach" },
  { id: "engagement", name: "Engagement" },
  { id: "conversions", name: "Conversions" },
  { id: "retention", name: "Retention" },
];

const MarketingContentScreen: React.FC<MarketingContentScreenProps> = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
  prevStep,
}) => {
  const [contentFocus, setContentFocus] = useState<string[]>(
    onboardingData.contentFocus || []
  );
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>(
    onboardingData.preferredPlatforms || []
  );
  const [contentKPIs, setContentKPIs] = useState<string[]>(
    onboardingData.contentKPIs || []
  );
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setContentFocus(onboardingData.contentFocus || []);
    setPreferredPlatforms(onboardingData.preferredPlatforms || []);
    setContentKPIs(onboardingData.contentKPIs || []);
  }, [onboardingData]);

  const toggleSelection = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string
  ) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setFormError("");
  };

  const handleContinue = () => {
    setFormError("");
    if (
      contentFocus.length === 0 ||
      preferredPlatforms.length === 0 ||
      contentKPIs.length === 0
    ) {
      setFormError("Please select at least one option for each question.");
      return;
    }
    updateOnboardingData({
      contentFocus,
      preferredPlatforms,
      contentKPIs,
    });
    nextStep();
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-montserrat font-semibold text-[#D4AF37] mb-6">
        Tell us about your Marketing & Content
      </h1>
      <div className="space-y-8">
        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            What type of content do you produce?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contentFocusOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleSelection(setContentFocus, option.id)}
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  contentFocus.includes(option.id)
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      contentFocus.includes(option.id)
                        ? "border-gold"
                        : "border-white/40"
                    }`}
                  >
                    {contentFocus.includes(option.id) && (
                      <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                    )}
                  </div>
                  <span className="ml-2 text-sm">{option.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            Where do you publish most?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preferredPlatformsOptions.map((option) => (
              <div
                key={option.id}
                onClick={() =>
                  toggleSelection(setPreferredPlatforms, option.id)
                }
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  preferredPlatforms.includes(option.id)
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      preferredPlatforms.includes(option.id)
                        ? "border-gold"
                        : "border-white/40"
                    }`}
                  >
                    {preferredPlatforms.includes(option.id) && (
                      <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                    )}
                  </div>
                  <span className="ml-2 text-sm">{option.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-light text-sm font-medium mb-2">
            What metric matters most? (Content KPIs)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contentKPIsOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleSelection(setContentKPIs, option.id)}
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  contentKPIs.includes(option.id)
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      contentKPIs.includes(option.id)
                        ? "border-gold"
                        : "border-white/40"
                    }`}
                  >
                    {contentKPIs.includes(option.id) && (
                      <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                    )}
                  </div>
                  <span className="ml-2 text-sm">{option.name}</span>
                </div>
              </div>
            ))}
          </div>
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

export default MarketingContentScreen;
