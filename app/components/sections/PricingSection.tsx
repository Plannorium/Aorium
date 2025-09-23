import React from "react";
import Link from "next/link";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { CheckCircleIcon } from "lucide-react";

const PricingSection = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="p-8" variant="default" hover={true}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-montserrat font-semibold text-[#D4AF37] mb-2">
                Starter
              </h3>
              <div className="text-3xl font-bold text-neutral-light mb-1">
                $99
                <span className="text-sm font-normal text-neutral-light/60">
                  /mo
                </span>
              </div>
              <p className="text-neutral-light/70">For small businesses</p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Basic analytics",
                "5 dashboards",
                "30-day data history",
                "Email support",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircleIcon
                    size={18}
                    className="text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-neutral-light/90">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="w-full">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </Card>
          {/* Pro Plan */}
          <Card className="p-8 relative" variant="highlight" hover={true}>
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold/80 to-gold"></div>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-primary-dark text-xs font-bold uppercase py-1 px-3 rounded-full">
              Most Popular
            </div>
            <div className="text-center mb-6 pt-2">
              <h3 className="text-xl font-montserrat font-semibold text-[#D4AF37] mb-2">
                Professional
              </h3>
              <div className="text-3xl font-bold text-neutral-light mb-1">
                $299
                <span className="text-sm font-normal text-neutral-light/60">
                  /mo
                </span>
              </div>
              <p className="text-neutral-light/70">For growing companies</p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Advanced analytics",
                "Unlimited dashboards",
                "1-year data history",
                "AI insights",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircleIcon
                    size={18}
                    className="text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-neutral-light/90">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>
          {/* Enterprise Plan */}
          <Card className="p-8" variant="default" hover={true}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-montserrat font-semibold text-[#D4AF37] mb-2">
                Enterprise
              </h3>
              <div className="text-3xl font-bold text-neutral-light mb-1">
                Custom
              </div>
              <p className="text-neutral-light/70">For large organizations</p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Custom analytics",
                "Unlimited everything",
                "Full data history",
                "Advanced AI features",
                "Dedicated support",
                "Custom integrations",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircleIcon
                    size={18}
                    className="text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-neutral-light/90">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
