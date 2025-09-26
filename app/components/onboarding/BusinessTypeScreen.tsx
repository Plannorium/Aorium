import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  BuildingIcon,
  UsersIcon,
  MapPinIcon,
} from "lucide-react";
import { OnboardingData } from "../onboarding/Onboarding";
import Card from "../ui/Card";
interface BusinessTypeScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}
const businessTypes = [
  {
    id: "retail",
    name: "Retail & E-commerce",
  },
  {
    id: "finance",
    name: "Finance & Banking",
  },
  {
    id: "tech",
    name: "Technology & SaaS",
  },
  {
    id: "healthcare",
    name: "Healthcare & Wellness",
  },
  {
    id: "education",
    name: "Education & Training",
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industry",
  },
  {
    id: "real-estate",
    name: "Real Estate & Construction",
  },
  {
    id: "other",
    name: "Other",
  },
];
const businessSizes = [
  {
    id: "startup",
    name: "Startup (1-10 employees)",
  },
  {
    id: "small",
    name: "Small Business (11-50 employees)",
  },
  {
    id: "medium",
    name: "Medium Enterprise (51-250 employees)",
  },
  {
    id: "large",
    name: "Large Enterprise (251+ employees)",
  },
];
const regions = [
  {
    id: "uae",
    name: "United Arab Emirates",
  },
  {
    id: "ksa",
    name: "Saudi Arabia",
  },
  {
    id: "qatar",
    name: "Qatar",
  },
  {
    id: "kuwait",
    name: "Kuwait",
  },
  {
    id: "bahrain",
    name: "Bahrain",
  },
  {
    id: "oman",
    name: "Oman",
  },
  {
    id: "multiple",
    name: "Multiple GCC Countries",
  },
];
const BusinessTypeScreen = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
  prevStep,
}: BusinessTypeScreenProps) => {
  const [businessType, setBusinessType] = useState(onboardingData.businessType);
  const [businessSize, setBusinessSize] = useState(onboardingData.businessSize);
  const [region, setRegion] = useState(onboardingData.region);
  const [formError, setFormError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    setBusinessType(onboardingData.businessType);
    setBusinessSize(onboardingData.businessSize);
    setRegion(onboardingData.region);
  }, [onboardingData]);

  const handleContinue = () => {
    setFormError("");
    if (currentQuestion === 0) {
      if (!businessType) {
        setFormError("Please select a business type");
        return;
      }
      setCurrentQuestion(1);
    } else if (currentQuestion === 1) {
      if (!businessSize) {
        setFormError("Please select a business size");
        return;
      }
      setCurrentQuestion(2);
    } else if (currentQuestion === 2) {
      if (!region) {
        setFormError("Please select a primary region");
        return;
      }
      updateOnboardingData({
        businessType,
        businessSize,
        region,
      });
      nextStep();
    }
  };

  const handleBack = () => {
    setFormError("");
    if (currentQuestion === 0) {
      prevStep();
    } else {
      setCurrentQuestion((prev) => prev - 1);
    }
  };
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-montserrat font-semibold text-[#D4AF37] mb-6">
        Tell us about your business
      </h1>
      <div className="space-y-8">
        {currentQuestion === 0 && (
          <div>
            <div className="flex items-center mb-4">
              <BuildingIcon size={20} className="text-[#D4AF37] mr-2" />
              <h2 className="text-xl font-montserrat font-medium text-neutral-light">
                Business Type
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {businessTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    setBusinessType(type.id);
                    setFormError("");
                  }}
                  className={`cursor-pointer p-3 rounded-lg border transition-all ${
                    businessType === type.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        businessType === type.id
                          ? "border-gold"
                          : "border-white/40"
                      }`}
                    >
                      {businessType === type.id && (
                        <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                      )}
                    </div>
                    <span className="ml-2 text-sm">{type.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentQuestion === 1 && (
          <div>
            <div className="flex items-center mb-4">
              <UsersIcon size={20} className="text-[#D4AF37] mr-2" />
              <h2 className="text-xl font-montserrat font-medium text-neutral-light">
                Business Size
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {businessSizes.map((size) => (
                <div
                  key={size.id}
                  onClick={() => {
                    setBusinessSize(size.id);
                    setFormError("");
                  }}
                  className={`cursor-pointer p-3 rounded-lg border transition-all ${
                    businessSize === size.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        businessSize === size.id
                          ? "border-gold"
                          : "border-white/40"
                      }`}
                    >
                      {businessSize === size.id && (
                        <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                      )}
                    </div>
                    <span className="ml-2 text-sm">{size.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentQuestion === 2 && (
          <div>
            <div className="flex items-center mb-4">
              <MapPinIcon size={20} className="text-[#D4AF37] mr-2" />
              <h2 className="text-xl font-montserrat font-medium text-neutral-light">
                Primary Region
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {regions.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => {
                    setRegion(reg.id);
                    setFormError("");
                  }}
                  className={`cursor-pointer p-3 rounded-lg border transition-all ${
                    region === reg.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        region === reg.id ? "border-gold" : "border-white/40"
                      }`}
                    >
                      {region === reg.id && (
                        <div className="w-2 h-2 rounded-full bg-gold m-0.5"></div>
                      )}
                    </div>
                    <span className="ml-2 text-sm">{reg.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {formError && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg">
            {formError}
          </div>
        )}
        <div className="flex justify-between pt-4">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back
          </Button>
          <Button onClick={handleContinue}>
            Continue
            <ArrowRightIcon size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default BusinessTypeScreen;
