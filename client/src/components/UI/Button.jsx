import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    whatsapp: 'btn-whatsapp',
    accent: 'btn-accent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-10 py-5 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variants[variant] || `btn-${variant}`} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
