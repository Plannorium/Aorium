"use client";
import React, { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseEnter = () => {
      setIsHovering(true);
    };

    const onMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      className={`fixed w-6 h-6 bg-[#D4AF37] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-in-out ${
        isHovering ? "scale-125" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        boxShadow: "0 0 10px #D4AF37, 0 0 20px #D4AF37",
      }}
    />
  );
};

export default CustomCursor;
