import React from 'react';

const Badge = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    success: 'badge-green',
    danger: 'badge-red',
    warning: 'badge-amber',
    info: 'badge-blue'
  };

  return (
    <span className={`badge ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
