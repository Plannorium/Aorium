"use client";

import HeroSection from "./components/sections/HeroSection";
import PricingSection from "./components/sections/PricingSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import React, { useRef } from "react";
import CTASection from "./components/sections/CTASection";

const Page = () => {
  const ctaCardRef = useRef<HTMLDivElement>(null);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ctaCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    card.style.setProperty("--gradient-angle", `${angle}deg`);
  };

  return (
    <div className="min-h-screen text-neutral-light">
      <div className="bg-primary-dark">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
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
              <div className="text-white/60 text-sm">
                © {new Date().getFullYear()} Aorium. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page;
