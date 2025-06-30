import React, { useState } from 'react';

const ThreeYearPictureSection = ({ threeYearPicture, onUpdate, isActive, onActivate }) => {
  const [editingPicture, setEditingPicture] = useState(threeYearPicture);

  const handleSave = () => {
    onUpdate(editingPicture);
    onActivate();
  };

  const handleCancel = () => {
    setEditingPicture(threeYearPicture);
    onActivate();
  };

  const isEmpty = !threeYearPicture;
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + 3;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>3-Year Picture</h4>
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
            {threeYearPicture.length > 150 
              ? `${threeYearPicture.substring(0, 150)}...` 
              : threeYearPicture
            }
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Paint a clear picture of what your organization will look like in {targetYear}.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to create your 3-year picture
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Your 3-Year Picture describes what your organization will look like three years from now. 
            It should be vivid and specific enough that everyone can see and feel what success looks like.
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              3-Year Picture ({targetYear} Vision)
            </label>
            <textarea
              value={editingPicture}
              onChange={(e) => setEditingPicture(e.target.value)}
              placeholder={`Describe your organization in ${targetYear}. What will revenue be? How many employees? What will your culture feel like? What systems will be in place? What will customers say about you?`}
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
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>3-Year Picture Categories:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>Revenue/Financial:</strong> Annual revenue, profit margins, cash flow<br/>
              <strong>Team:</strong> Number of employees, organizational structure, culture<br/>
              <strong>Market Position:</strong> Market share, reputation, competitive advantage<br/>
              <strong>Operations:</strong> Systems, processes, technology, efficiency<br/>
              <strong>Physical:</strong> Locations, facilities, equipment<br/>
              <strong>Future Focus:</strong> What you'll be known for, innovation pipeline
            </div>
          </div>

          {/* Example */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Example 3-Year Picture:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>By {targetYear}:</strong><br/>
              • $15M annual revenue with 20% profit margins<br/>
              • 75 passionate team members across 3 locations<br/>
              • #1 marketing agency for SaaS companies in our region<br/>
              • Fully integrated CRM, project management, and financial systems<br/>
              • 95% client retention rate with net promoter score of 80+<br/>
              • Modern headquarters that reflects our innovative culture<br/>
              • Known as the "go-to experts" for SaaS marketing strategies<br/>
              • Strong leadership team with clear succession planning
            </div>
          </div>

          {/* Connecting 3-Year to 10-Year */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>🎯 Bridge to 10-Year Target:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              Your 3-Year Picture should be a significant milestone toward your 10-Year Target. 
              Think of it as base camp before reaching the summit. It should show meaningful 
              progress while setting up the foundation for your ultimate goal.
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#7b1fa2' }}>💡 3-Year Picture Tips:</h5>
            <ul style={{ fontSize: '0.8rem', color: '#666', margin: '0', paddingLeft: '1rem' }}>
              <li>Use present tense - write as if you're already there</li>
              <li>Include specific numbers and metrics</li>
              <li>Paint a picture anyone can visualize</li>
              <li>Cover all key areas of your business</li>
              <li>Make sure it feels achievable and exciting</li>
              <li>Update annually as you get closer</li>
            </ul>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save 3-Year Picture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeYearPictureSection;