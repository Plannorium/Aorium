import React, { useState, useEffect, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  bgColor?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  bgColor,
  height,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 ${
        bgColor || "bg-[#0f172a]"
      } ${height || "h-auto"}`}
    >
      <div className="bg-[#0f172a] p-8 rounded-lg shadow-lg max-w-3xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-white text-3xl font-bold mb-6 text-center">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
