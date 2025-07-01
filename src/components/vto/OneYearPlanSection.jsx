import React, { useState } from 'react';

const OneYearPlanSection = ({ oneYearPlan, onUpdate, isActive, onActivate }) => {
  const [editingPlan, setEditingPlan] = useState(oneYearPlan);

  const handleSave = () => {
    onUpdate(editingPlan);
    onActivate();
  };

  const handleCancel = () => {
    setEditingPlan(oneYearPlan);
    onActivate();
  };

  const isEmpty = !oneYearPlan;
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>1-Year Plan</h4>
          {isEmpty && <span className="empty-indicator">Empty</span>}
          {!isEmpty && <span className="completion-indicator">Complete</span>}
        </div>
        <span className="expand-icon">{isActive ? '−' : '+'}</span>
      </div>

      {!isActive && !isEmpty && (
        <div className="vto-section-preview">
          <div style={{ 
            fontSize: '0.9rem', 
            lineHeight: '1.4',
            color: '#333'
          }}>
            {oneYearPlan.length > 150 
              ? `${oneYearPlan.substring(0, 150)}...` 
              : oneYearPlan
            }
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Define your key priorities and goals for {nextYear}.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to create your 1-year plan
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Your 1-Year Plan defines what you must accomplish this year to stay on track 
            toward your 3-Year Picture and 10-Year Target. Focus on the vital few priorities.
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              1-Year Plan ({nextYear} Priorities)
            </label>
            <textarea
              value={editingPlan}
              onChange={(e) => setEditingPlan(e.target.value)}
              placeholder={`What are the 3-7 most important things you must accomplish in ${nextYear}? Include revenue goals, key initiatives, team development, and operational improvements.`}
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Framework */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>1-Year Plan Categories:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>Revenue/Financial:</strong> What are your revenue and profit goals?<br/>
              <strong>People:</strong> Who do you need to hire? What training is needed?<br/>
              <strong>Marketing:</strong> What marketing initiatives will drive growth?<br/>
              <strong>Operations:</strong> What systems need to be improved or implemented?<br/>
              <strong>Product/Service:</strong> What offerings will you launch or improve?<br/>
              <strong>Culture:</strong> How will you strengthen your team and culture?
            </div>
          </div>

          {/* Example */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Example 1-Year Plan:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>{nextYear} Priorities:</strong><br/>
              • Achieve $5M revenue with 15% profit margin<br/>
              • Hire 8 new team members (2 sales, 3 operations, 3 support)<br/>
              • Launch new premium service line<br/>
              • Implement CRM and project management systems<br/>
              • Open second office location<br/>
              • Achieve 95% customer satisfaction rating<br/>
              • Complete leadership development program for all managers
            </div>
          </div>

          {/* Connection to Rocks */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>💡 From Plan to Rocks:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              Your 1-Year Plan should drive your quarterly Rocks (90-day priorities). 
              Each quarter, select 3-7 Rocks that move you closer to achieving your annual plan. 
              This creates a clear connection from your long-term vision to your daily actions.
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#7b1fa2' }}>🎯 1-Year Plan Tips:</h5>
            <ul style={{ fontSize: '0.8rem', color: '#666', margin: '0', paddingLeft: '1rem' }}>
              <li>Limit to 3-7 key priorities - focus on the vital few</li>
              <li>Make sure each priority moves you toward your 3-Year Picture</li>
              <li>Include specific, measurable goals</li>
              <li>Balance different areas: revenue, people, systems, culture</li>
              <li>Review and update quarterly as you set new Rocks</li>
              <li>Make sure priorities can realistically be achieved</li>
            </ul>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save 1-Year Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneYearPlanSection;