import React from 'react';

const StatCard = ({ label, value, subValue, icon: Icon, color }) => {
  return (
    <div className="card flex-1 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm opacity-60 font-medium">{label}</span>
        {Icon && (
          <div className="p-2 rounded-lg" style={{ background: `${color}15`, color: color }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <h2 className="text-3xl font-display">{value}</h2>
      {subValue && (
        <p className="text-xs opacity-50 font-medium">{subValue}</p>
      )}
    </div>
  );
};

export default StatCard;
