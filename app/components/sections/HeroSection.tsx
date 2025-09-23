import React from "react";
import Button from "../ui/Button";
import { ArrowRightIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-[#071a3a] overflow-hidden">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071a3a] via-[#0a1f42] to-[#071a3a]"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col justify-start items-center">
        <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] font-medium mb-6 animate-fadeIn bg-gradient-to-r from-[#D4AF37]/20 to-transparent">
          AI-Powered Business Intelligence
        </span>
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline banner */}
          <div className="inline-block bg-[#D4AF37] px-8 py-4 mb-8 transform -rotate-1">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#0f172a] leading-tight">
              Unlock Business Insights with
              <br />
              AI-Powered Analytics
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Aorium delivers cultural and market insights for businesses
            targeting GCC regions through powerful AI analytics and
            visualizations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#0f172a] font-semibold px-8 py-3 rounded-lg transition-all duration-200">
              Get Started Free
              <ArrowRightIcon size={18} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border border-[#D4AF37] text-[#D4AF37] hover:bg-white/10 px-8 py-3 rounded-lg transition-all duration-200"
            >
              See Demo
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-3xl mx-auto">
            {/* Subtle glow effect behind the image */}
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl rounded-3xl"></div>

            {/* Main dashboard image */}
            <div className="relative bg-white rounded-2xl p-4 shadow-2xl transform rotate-1">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop"
                alt="Aorium Dashboard Preview showing analytics charts, data visualizations, and business intelligence metrics"
                className="rounded-xl w-full h-auto shadow-lg"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#D4AF37]/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white/10 rounded-full blur-md"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071a3a] to-transparent"></div>
    </section>
  );
};

export default HeroSection;
