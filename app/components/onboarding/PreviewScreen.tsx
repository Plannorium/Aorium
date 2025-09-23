import React from "react";
import Button from "../ui/Button";
import {
  ArrowLeftIcon,
  CheckIcon,
  BuildingIcon,
  UsersIcon,
  MapPinIcon,
  TargetIcon,
  FileIcon,
  ArrowRightIcon,
} from "lucide-react";
import { OnboardingData } from "../../onboarding/page";
import Card from "../ui/Card";
interface PreviewScreenProps {
  onboardingData: OnboardingData;
  prevStep: () => void;
  completeOnboarding: () => void;
  isLoading: boolean;
}
const businessTypes: Record<string, string> = {
  retail: "Retail & E-commerce",
  finance: "Finance & Banking",
  tech: "Technology & SaaS",
  healthcare: "Healthcare & Wellness",
  education: "Education & Training",
  hospitality: "Hospitality & Tourism",
  manufacturing: "Manufacturing & Industry",
  "real-estate": "Real Estate & Construction",
  other: "Other",
};
const businessSizes: Record<string, string> = {
  startup: "Startup (1-10 employees)",
  small: "Small Business (11-50 employees)",
  medium: "Medium Enterprise (51-250 employees)",
  large: "Large Enterprise (251+ employees)",
};
const regions: Record<string, string> = {
  uae: "United Arab Emirates",
  ksa: "Saudi Arabia",
  qatar: "Qatar",
  kuwait: "Kuwait",
  bahrain: "Bahrain",
  oman: "Oman",
  multiple: "Multiple GCC Countries",
};
const goalLabels: Record<string, string> = {
  market_insights: "Market Insights",
  competitor_analysis: "Competitor Analysis",
  cultural_localization: "Cultural Localization",
  growth_opportunities: "Growth Opportunities",
  customer_segmentation: "Customer Segmentation",
  operational_efficiency: "Operational Efficiency",
  regulatory_compliance: "Regulatory Compliance",
  marketing_optimization: "Marketing Optimization",
};
const PreviewScreen = ({
  onboardingData,
  prevStep,
  completeOnboarding,
  isLoading,
}: PreviewScreenProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#FFD700] mb-6 text-center">
        Review Your Setup
      </h1>
      <p className="text-[#F8F9FA] mb-8 text-center max-w-2xl mx-auto">
        Please take a moment to review your information before finalizing your
        account setup. You can easily make changes by navigating back to
        previous steps.
      </p>
      <div className="space-y-8 mb-10">
        {/* Business Information */}
        <Card className="p-8 bg-[#333333] border border-[#FFD700]/20 rounded-xl shadow-lg">
          <h2 className="text-2xl font-montserrat font-semibold text-[#FFD700] mb-6 border-b border-gold/30 pb-3">
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <BuildingIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Business Name
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.businessName || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <BuildingIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Business Type
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {businessTypes[onboardingData.businessType] ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <UsersIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Business Size
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {businessSizes[onboardingData.businessSize] ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Primary Region
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {regions[onboardingData.region] || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Business Context */}
        <Card className="p-8 bg-[#333333] border border-[#FFD700]/20 rounded-xl shadow-lg">
          <h2 className="text-2xl font-montserrat font-semibold text-[#FFD700] mb-6 border-b border-gold/30 pb-3">
            Business Context
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <UsersIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Competitors
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.competitors || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <TargetIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Target Audience
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.targetAudience || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <BuildingIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Industry Challenges
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.industryChallenges || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Marketing & Content */}
        <Card className="p-8 bg-[#333333] border border-[#FFD700]/20 rounded-xl shadow-lg">
          <h2 className="text-2xl font-montserrat font-semibold text-[#FFD700] mb-6 border-b border-gold/30 pb-3">
            Marketing & Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <TargetIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Content Focus
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.contentFocus?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Preferred Platforms
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.preferredPlatforms?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CheckIcon
                size={24}
                className="text-[#007BFF] mr-4 flex-shrink-0"
              />
              <div>
                <h3 className="text-[#F8F9FA] text-sm uppercase tracking-wider">
                  Content KPIs
                </h3>
                <p className="text-[#F8F9FA] font-medium text-lg">
                  {onboardingData.contentKPIs?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-8 bg-[#333333] border border-[#FFD700]/20 rounded-xl shadow-lg">
          <div className="flex items-center mb-6 border-b border-[#FFD700]/30 pb-3">
            <TargetIcon size={24} className="text-[#FFD700] mr-3" />
            <h2 className="text-2xl font-montserrat font-semibold text-[#FFD700]">
              Selected Goals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingData.goals && onboardingData.goals.length > 0 ? (
              onboardingData.goals.map((goalId) => (
                <div
                  key={goalId}
                  className="flex items-center p-2 bg-neutral-dark/50 rounded-md"
                >
                  <CheckIcon size={20} className="text-gold mr-3" />
                  <span className="text-neutral-light text-lg">
                    {goalLabels[goalId] || "Unknown Goal"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#F8F9FA] italic text-lg">No goals selected</p>
            )}
          </div>
        </Card>
        {/* Uploaded Files */}
        <Card className="p-8 bg-neutral-dark border border-gold/20 rounded-xl shadow-lg">
          <div className="flex items-center mb-6 border-b border-[#FFD700]/30 pb-3">
            <FileIcon size={24} className="text-gold mr-3" />
            <h2 className="text-2xl font-montserrat font-semibold text-[#FFD700]">
              Uploaded Data Files
            </h2>
          </div>
          {onboardingData.uploadedFiles &&
          onboardingData.uploadedFiles.length > 0 ? (
            <ul className="space-y-3">
              {onboardingData.uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center">
                  <FileIcon size={16} className="text-secondary mr-2" />
                  <span className="text-neutral-light">
                    {file.original_filename} ({file.section})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-light italic">No files uploaded</p>
          )}
        </Card>
      </div>
      <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0 mt-1">
            <CheckIcon size={20} className="text-gold" />
          </div>
          <div className="ml-3">
            <h3 className="text-gold font-medium">Ready to go!</h3>
            <p className="text-neutral-light text-sm mt-1">
              Your personalized AI dashboard is ready to be generated. Click
              &lsquo;Complete Setup&lsquo; to finalize your account and access
              your insights.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button onClick={prevStep} variant="outline">
          <ArrowLeftIcon size={16} className="mr-2" />
          Make Changes
        </Button>
        <Button onClick={completeOnboarding} disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Completing...
            </>
          ) : (
            <>
              Complete Setup <ArrowRightIcon size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
export default PreviewScreen;
