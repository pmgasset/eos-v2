import React from 'react';

const StatCard = ({ title, value, label }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;