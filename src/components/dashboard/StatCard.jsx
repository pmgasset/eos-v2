import React from 'react';

const StatCard = ({ title, value, label, color = '#1976d2', icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          {icon && <span className="stat-card-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
      </div>
      
      <div className="stat-card-content">
        <div className="stat-number" style={{ color }}>
          {value}
        </div>
        <div className="stat-label">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatCard;