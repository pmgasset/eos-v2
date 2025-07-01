import React, { useState } from 'react';

const TenYearTargetSection = ({ tenYearTarget, onUpdate, isActive, onActivate }) => {
  const [editingTarget, setEditingTarget] = useState(tenYearTarget);

  const handleSave = () => {
    onUpdate(editingTarget);
    onActivate();
  };

  const handleCancel = () => {
    setEditingTarget(tenYearTarget);
    onActivate();
  };

  const isEmpty = !tenYearTarget;
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + 10;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>10-Year Target</h4>
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
            {tenYearTarget.length > 150 
              ? `${tenYearTarget.substring(0, 150)}...` 
              : tenYearTarget
            }
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Create an inspiring, specific goal for where you'll be in {targetYear}.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to define your 10-year target
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Your 10-Year Target is a long-term goal that excites and inspires your entire organization. 
            It should be specific, measurable, and compelling enough to energize everyone for the journey ahead.
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              10-Year Target (By {targetYear})
            </label>
            <textarea
              value={editingTarget}
              onChange={(e) => setEditingTarget(e.target.value)}
              placeholder={`Where do you see your company in ${targetYear}? Include revenue goals, market position, team size, geographic reach, or impact metrics.`}
              rows={4}
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
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>10-Year Target Framework:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>SPECIFIC:</strong> Clear, concrete numbers and descriptions<br/>
              <strong>MEASURABLE:</strong> Include quantifiable metrics<br/>
              <strong>INSPIRING:</strong> Exciting enough to motivate your team<br/>
              <strong>ACHIEVABLE:</strong> Ambitious but realistic<br/>
              <strong>ALIGNED:</strong> Supports your Core Focus and Values
            </div>
          </div>

          {/* Examples */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Example 10-Year Targets:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>Software Company:</strong><br/>
              "By {targetYear}, we'll be the leading project management platform for creative agencies, serving 50,000+ companies globally with $100M annual recurring revenue and 500 team members across 3 continents."<br/><br/>
              
              <strong>Service Business:</strong><br/>
              "By {targetYear}, we'll be the premier marketing agency for B2B SaaS companies in North America, generating $25M annually while helping 1,000+ clients achieve their growth goals with our team of 100 experts."
            </div>
          </div>

          {/* Connection to Vision */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>🎯 Connecting Vision to Target:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              Your 10-Year Target should be the quantified expression of your Core Focus. 
              It takes your Purpose and Niche and gives them specific, measurable form. 
              This target becomes the North Star that guides all shorter-term planning.
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#7b1fa2' }}>💡 10-Year Target Tips:</h5>
            <ul style={{ fontSize: '0.8rem', color: '#666', margin: '0', paddingLeft: '1rem' }}>
              <li>Include specific numbers (revenue, customers, employees, locations)</li>
              <li>Make it exciting - people should get energized when they hear it</li>
              <li>Keep it to 1-2 sentences maximum</li>
              <li>Test it: Can everyone remember and repeat it?</li>
              <li>Make sure it aligns with your Core Focus</li>
              <li>Update it only when fundamentally necessary</li>
            </ul>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save 10-Year Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenYearTargetSection;