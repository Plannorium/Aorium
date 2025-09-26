"use client";
import React from "react";
import FeatureCard from "../components/ui/FeatureCard";
import {
  BrainIcon,
  LayoutDashboardIcon,
  BarChart2Icon,
  GlobeIcon,
  ShareIcon,
  TwitterIcon,
  UploadCloudIcon,
  UserCircle2Icon,
  UsersIcon,
} from "lucide-react";

const FeaturesPageSection = () => {
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
            title="Benchmarking"
            description="Compare your business performance against industry benchmarks and competitors."
            icon={UsersIcon}
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
          <FeatureCard
            title="Twitter Integration"
            description="Connect your Twitter account to analyze your social media performance and get real-time insights."
            icon={TwitterIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="File Upload"
            description="Easily upload your data files in various formats to get instant analysis and visualizations."
            icon={UploadCloudIcon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
          <FeatureCard
            title="User Profile Management"
            description="Manage your profile, settings, and preferences in one place."
            icon={UserCircle2Icon}
            className="bg-[#0f172a] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

const FeaturesPage = () => {
  return (
    <div className="min-h-screen text-neutral-light">
      <div className="bg-primary-dark">
        <FeaturesPageSection />
        <footer className="py-10 border-t border-white/10 bg-primary-dark">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <img
                  src="/Aorium.png"
                  alt="Aorium Logo"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-[#D4AF37] font-semibold text-lg">
                  AORIUM
                </span>
              </div>
              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <Link href="/terms" className="hover:underline">
                  Terms and Services
                </Link>
                <span>© {new Date().getFullYear()} Aorium. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FeaturesPage;
