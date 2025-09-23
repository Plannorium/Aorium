"use client";
import React from "react";
import FeatureCard from "../ui/FeatureCard";
import {
  BrainIcon,
  LayoutDashboardIcon,
  BarChart2Icon,
  GlobeIcon,
  ShareIcon,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-[#071a3a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] font-medium mb-6 animate-fadeIn bg-gradient-to-r from-[#D4AF37]/20 to-transparent">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 text-[#D4AF37]">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-neutral-light/80 max-w-3xl mx-auto leading-relaxed">
            Our platform combines advanced AI with intuitive design to deliver
            actionable insights for your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="AI-Powered Analytics"
            description="Advanced machine learning algorithms analyze your data to uncover patterns and insights that drive business growth."
            icon={BrainIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="Interactive Dashboards"
            description="Customizable dashboards with real-time data visualization make complex information easy to understand and act upon."
            icon={LayoutDashboardIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="Market Insights"
            description="Gain deep understanding of market trends and consumer behavior specific to GCC regions."
            icon={BarChart2Icon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="Cultural Localization"
            description="Tailor your business approach with culturally relevant insights and recommendations for the GCC market."
            icon={GlobeIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="Shareable Reports"
            description="Generate professional reports and easily share them with your team or stakeholders with one click."
            icon={ShareIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="Multilingual Support"
            description="Full support for both English and Arabic interfaces, making insights accessible to your entire team."
            icon={GlobeIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
