import React, { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { CheckCircleIcon } from "lucide-react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      description: "For individuals and hobbyists",
      features: [
        "1 User",
        "AI-powered Chat Assistant (10 queries / month)",
        "Basic Analytics Dashboard",
        "Market News (Limited)",
        "File Upload (up to 2 files / month, 5MB each)",
        "Community Support",
      ],
      buttonText: "Get Started",
      href: "/auth/register",
      variant: "default",
    },
    {
      name: "Starter",
      price: {
        monthly: "$38",
        yearly: "$30",
      },
      description: "For small businesses and startups",
      features: [
        "Up to 3 Users",
        "AI-powered Chat Assistant (150 queries / month)",
        "Advanced Analytics & Analysis Results",
        "File Upload (up to 20 files / month, 50MB each)",
        "Data Export (CSV format)",
        "Standard Support",
      ],
      buttonText: "Get Started",
      href: "/auth/register",
      variant: "default",
    },
    {
      name: "Pro",
      price: {
        monthly: "$99",
        yearly: "$79",
      },
      description: "For growing businesses",
      features: [
        "Up to 10 Users",
        "AI-powered Chat Assistant (Unlimited queries)",
        "Advanced Analytics & Analysis Results",
        "Benchmarking (up to 5 competitors)",
        "Twitter Integration (up to 3 accounts)",
        "File Upload (up to 100 files / month, 200MB each)",
        "Data Export (CSV, PDF formats)",
        "Priority Support",
      ],
      buttonText: "Get Started",
      href: "/auth/register",
      variant: "highlight",
    },
    {
      name: "Enterprise",
      price: {
        monthly: "Custom",
        yearly: "Custom",
      },
      description: "For large organizations",
      features: [
        "Unlimited Users",
        "All features from the Pro Plan",
        "Benchmarking (Unlimited competitors)",
        "Twitter Integration (Unlimited accounts)",
        "File Upload (Unlimited)",
        "Custom Data Export formats",
        "Dedicated Account Manager",
        "On-premise deployment option",
        "Advanced security & compliance features",
      ],
      buttonText: "Contact Sales",
      href: "https://calendly.com/team-plannorium_/aorium-demo",
      variant: "default",
    },
  ] as const;

  return (
    <section id="pricing" className="py-24 bg-primary-dark relative">
      <div className="absolute inset-0 bg-wave-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] font-medium mb-6 animate-fadeIn bg-gradient-to-r from-[#D4AF37]/20 to-transparent">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 text-[#D4AF37]">
            Choose Your Plan
          </h2>
          <p className="text-lg md:text-xl text-neutral-light/80 max-w-2xl mx-auto leading-relaxed">
            Flexible options to suit businesses of all sizes targeting the GCC
            market
          </p>
        </div>

        <div className="flex justify-center items-center mb-12">
          <span
            className={`mr-4 ${
              billingCycle === "monthly"
                ? "text-[#D4AF37]"
                : "text-neutral-light/70"
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
          </label>
          <span
            className={`ml-4 ${
              billingCycle === "yearly"
                ? "text-[#D4AF37]"
                : "text-neutral-light/70"
            }`}
          >
            Yearly
          </span>
          <span className="ml-4 px-2 py-1 bg-gold/20 text-[#D4AF37] text-xs font-bold rounded-full">
            SAVE 20%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="p-8 flex flex-col"
              variant={plan.variant}
              hover={true}
            >
              {plan.variant === "highlight" && (
                <>
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold/80 to-gold"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-primary-dark text-xs font-bold uppercase py-1 px-3 rounded-full">
                    Most Popular
                  </div>
                </>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-montserrat font-semibold text-[#D4AF37] mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-neutral-light mb-1">
                  {plan.price[billingCycle]}
                  {plan.price[billingCycle] !== "Custom" && (
                    <span className="text-sm font-normal text-neutral-light/60">
                      /mo
                    </span>
                  )}
                </div>
                <p className="text-neutral-light/70">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      className="text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-neutral-light/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="w-full">
                <Button
                  variant={plan.variant === "highlight" ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
