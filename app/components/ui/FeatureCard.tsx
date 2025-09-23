"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { BoxIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: typeof BoxIcon;
  className?: string;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className = "",
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = mouseX - rect.width / 2;
    const y = mouseY - rect.height / 2;

    // Border animation
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    card.style.setProperty("--start", `${angle + 60}deg`);

    // 3D tilt
    const rotateX = (y / (rect.height / 2)) * -7; // Max rotation
    const rotateY = (x / (rect.width / 2)) * 7;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s ease-in-out";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-border rounded-lg p-[1px] ${className}`}
    >
      <div
        className={`p-6 group bg-slate-800/20 backdrop-blur-sm rounded-lg shadow-lg h-full`}
      >
        <div className="flex flex-col items-start">
          <div className="p-4 rounded-full bg-[#1e293b]/50 text-[#D4AF37] mb-5 transition-all duration-300 group-hover:bg-[#334155]/50 group-hover:scale-110">
            <Icon size={32} />
          </div>
          <h3 className="font-montserrat font-bold text-2xl mb-3 text-neutral-light/90 transition-colors duration-300 group-hover:text-neutral-light">
            {title}
          </h3>
          <p className="text-neutral-light/80 transition-colors duration-300 group-hover:text-neutral-light/90">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
