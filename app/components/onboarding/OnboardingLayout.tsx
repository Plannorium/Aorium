import React from "react";
import Link from "next/link";
import { CheckIcon } from "lucide-react";
interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}
const steps = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Welcome to Plannorium.",
  },
  {
    id: "business",
    name: "Business",
    description: "Tell us about your business.",
  },
  {
    id: "context",
    name: "Context",
    description: "Provide business context.",
  },
  {
    id: "goals",
    name: "Goals",
    description: "Select your marketing goals.",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Define your marketing focus.",
  },
  {
    id: "data-specifics-upload",
    name: "Data Specifics & Upload",
    description: "Provide data specifics and upload your business data.",
  },
  {
    id: "preview",
    name: "Preview",
    description: "Review and complete.",
  },
];
const OnboardingLayout = ({ children, currentStep }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/home" className="flex items-center">
            <img src="/Aorium.png" alt="Aorium Logo" className="h-12 w-auto" />
            <span className="ml-2 text-[#D4AF37] font-montserrat font-semibold text-2xl">
              AORIUM
            </span>
          </Link>
        </div>
        {/* Progress Indicator */}
        <div className="hidden md:block mb-12">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, index) => (
                  <li
                    key={step.name}
                    className={`relative ${
                      index < steps.length - 1 ? "pr-8 flex-1" : ""
                    }`}
                  >
                    {index < currentStep ? (
                      // Completed step
                      <div className="group">
                        <span className="flex items-center">
                          <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-dark">
                            <CheckIcon className="h-6 w-6 text-[#D4AF37]" />
                          </span>
                          <span className="ml-3 text-base font-semibold text-white">
                            {step.name.length > 9
                              ? `${step.name.substring(0, 9)}...`
                              : step.name}
                          </span>
                        </span>
                        {index < steps.length - 1 && (
                          <span className="absolute top-5 left-5 -ml-px h-0.5 w-full bg-primary-dark" />
                        )}
                      </div>
                    ) : index === currentStep ? (
                      // Current step
                      <div className="group" aria-current="step">
                        <span className="flex items-center">
                          <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 border-gold-light">
                            <span className="text-[#D4AF37]-light">
                              {index + 1}
                            </span>
                          </span>
                          <span className="ml-3 text-base font-semibold text-white">
                            {step.name.length > 9
                              ? `${step.name.substring(0, 9)}...`
                              : step.name}
                          </span>
                        </span>

                        {index < steps.length - 1 && (
                          <span className="absolute top-5 left-5 -ml-px h-0.5 w-full bg-neutral-light/20" />
                        )}
                      </div>
                    ) : (
                      // Upcoming step
                      <div className="group">
                        <span className="flex items-center">
                          <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 border-neutral-light/30">
                            <span className="text-neutral-light">
                              {index + 1}
                            </span>
                          </span>
                          <span className="ml-3 text-base font-semibold text-neutral-light">
                            {step.name.length > 9
                              ? `${step.name.substring(0, 9)}...`
                              : step.name}
                          </span>
                        </span>
                        {index < steps.length - 1 && (
                          <span className="absolute top-5 left-5 -ml-px h-0.5 w-full bg-neutral-light/20" />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        {/* Mobile Progress Indicator */}
        <div className="md:hidden mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[#D4AF37] font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-neutral-light/70">
              {steps[currentStep].name.length > 9
                ? `${steps[currentStep].name.substring(0, 9)}...`
                : steps[currentStep].name}
            </span>
          </div>
          <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-gold h-1.5 rounded-full"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingLayout;
