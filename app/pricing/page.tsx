"use client";
import React from "react";
import PricingSection from "../components/sections/PricingSection";

const PricingPage = () => {
  return (
    <div className="min-h-screen text-neutral-light">
      <div className="bg-primary-dark">
        <PricingSection />
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

export default PricingPage;
