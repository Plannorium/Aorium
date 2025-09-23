import React, { useState } from "react";
import Button from "../ui/Button";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  TargetIcon,
} from "lucide-react";
import { OnboardingData } from "../../onboarding/page";
interface GoalSelectionScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}
const goals = [
  {
    id: "market_insights",
    title: "Market Insights",
    description:
      "Understand market trends and consumer behavior in GCC regions",
  },
  {
    id: "competitor_analysis",
    title: "Competitor Analysis",
    description:
      "Track competitors and identify opportunities for differentiation",
  },
  {
    id: "cultural_localization",
    title: "Cultural Localization",
    description: "Adapt your business approach to local cultural preferences",
  },
  {
    id: "growth_opportunities",
    title: "Growth Opportunities",
    description: "Identify new markets and expansion opportunities",
  },
  {
    id: "customer_segmentation",
    title: "Customer Segmentation",
    description: "Identify and target specific customer segments effectively",
  },
  {
    id: "operational_efficiency",
    title: "Operational Efficiency",
    description: "Optimize operations based on regional business practices",
  },
  {
    id: "regulatory_compliance",
    title: "Regulatory Compliance",
    description: "Stay informed about GCC regulations affecting your business",
  },
  {
    id: "marketing_optimization",
    title: "Marketing Optimization",
    description:
      "Improve marketing strategies based on local consumer behavior",
  },
];
const GoalSelectionScreen = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
  prevStep,
}: GoalSelectionScreenProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    onboardingData.goals
  );
  const [error, setError] = useState("");
  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
    setError("");
  };
  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one goal");
      return;
    }
    updateOnboardingData({
      goals: selectedGoals,
    });
    nextStep();
  };
  return (
    <div>
      <div className="flex items-center mb-6">
        <TargetIcon size={24} className="text-gold mr-3" />
        <h1 className="text-2xl md:text-3xl font-montserrat font-semibold text-gold">
          Select Your Business Goals
        </h1>
      </div>
      <p className="text-neutral-light/80 mb-8">
        Choose the objectives that matter most to your business. This will help
        us customize your analytics dashboard and AI insights.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              selectedGoals.includes(goal.id)
                ? "border-gold bg-gold/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 mt-1 w-5 h-5 rounded border ${
                  selectedGoals.includes(goal.id)
                    ? "bg-gold border-gold"
                    : "border-white/40"
                } flex items-center justify-center`}
              >
                {selectedGoals.includes(goal.id) && (
                  <CheckIcon size={14} className="text-primary-dark" />
                )}
              </div>
              <div className="ml-3">
                <h3
                  className={`font-medium ${
                    selectedGoals.includes(goal.id)
                      ? "text-gold"
                      : "text-neutral-light"
                  }`}
                >
                  {goal.title}
                </h3>
                <p className="text-sm text-neutral-light/70 mt-1">
                  {goal.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-light/70">
          <span className="text-gold font-medium">{selectedGoals.length}</span>{" "}
          of {goals.length} goals selected
        </div>
        <div className="flex space-x-4">
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
    </div>
  );
};
export default GoalSelectionScreen;
