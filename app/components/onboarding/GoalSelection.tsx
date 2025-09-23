import React, { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingData } from "../onboarding/Onboarding";

interface GoalSelectionProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onNext?: (goal: string) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
  prevStep,
  onNext,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(
    Array.isArray(onboardingData?.goals)
      ? onboardingData.goals[0] ?? null
      : onboardingData?.goals ?? null
  );
  const goals = ["Grow Sales", "Improve Marketing", "Cut Costs"];

  const onSelect = (goal: string) => {
    setSelectedGoal(goal);
  };

  return (
    <div className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4 text-white"
      >
        What is your primary business goal?
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col space-y-2 mb-4"
      >
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => onSelect(goal)}
            className={`py-2 px-4 rounded ${
              selectedGoal === goal
                ? "bg-[#D4AF37] text-[#0f172a]"
                : "bg-[#0f172a] hover:bg-[#B8941F] text-white"
            }`}
          >
            {goal}
          </button>
        ))}
      </motion.div>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => prevStep()}
          className="px-6 py-2 rounded bg-transparent border border-white/20 text-white"
        >
          Back
        </button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => {
            if (!selectedGoal) return;
            updateOnboardingData({ goals: [selectedGoal] });
            if (onNext) onNext(selectedGoal);
            nextStep();
          }}
          disabled={!selectedGoal}
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0f172a] font-semibold px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export default GoalSelection;
