import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'dark';
  hover?: boolean;
}
const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false
}: CardProps) => {
  const baseStyles = 'rounded-lg shadow-lg overflow-hidden transition-all duration-300';
  const variantStyles = {
    default: 'bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/10',
    highlight: 'bg-gold/5 backdrop-blur-sm border border-gold/20 shadow-xl shadow-gold/5',
    dark: 'bg-primary-dark border border-white/5 shadow-xl shadow-black/20'
  };
  const hoverStyles = hover ? 'hover:shadow-2xl hover:transform hover:-translate-y-1 hover:border-gold/30' : '';
  return <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>;
};
export default Card;