import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyles = "px-6 py-2 rounded font-bold transition-all duration-200";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white",
    secondary: "bg-[#252525] border border-cyan-500 text-cyan-400 hover:bg-[#2d2d2d]",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;