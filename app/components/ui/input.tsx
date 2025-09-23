import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded px-3 py-2 ${className}`}
      {...props}
    />
  );
};

export default Input;
