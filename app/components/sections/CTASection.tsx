"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

const CTASection = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    card.style.setProperty("--start", `${angle + 60}deg`);
  };

  return (
    <section className="py-24 bg-[#071a3a] relative overflow-hidden">
      {/* Glow accents */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#D4AF37]/10 blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#FFD700]/10 blur-3xl"></div>

      <div className="container mx-auto px-6">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="card-border max-w-3xl xl:max-w-4xl mx-auto rounded-2xl p-[1px] shadow-2xl relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="bg-[#0F2147]/80 backdrop-blur-md rounded-2xl p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#D4AF37] leading-snug">
              Ready to Transform Your Business Intelligence?
            </h2>
            <p className="text-lg mb-10 text-white/70">
              Join thousands of businesses already using Aorium to gain
              competitive advantage in the GCC market.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Primary button */}
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] text-[#0A1833] font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:shadow-[0_8px_20px_rgba(212,175,55,0.5)] hover:-translate-y-0.5"
              >
                Start Free Trial
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              {/* Secondary button */}
              <a
                href="https://calendly.com/team-plannorium_/aorium-demo"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                Request a Demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
