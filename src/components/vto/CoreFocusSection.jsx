import React, { useState } from 'react';

const CoreFocusSection = ({ coreFocus, onUpdate, isActive, onActivate }) => {
  const [editingFocus, setEditingFocus] = useState(coreFocus);

  const handleSave = () => {
    onUpdate(editingFocus);
    onActivate();
  };

  const handleCancel = () => {
    setEditingFocus(coreFocus);
    onActivate();
  };

  const handleChange = (field, value) => {
    setEditingFocus(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isEmpty = !coreFocus.purpose && !coreFocus.niche;
  const isComplete = coreFocus.purpose && coreFocus.niche;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Core Focus</h4>
          {isEmpty && <span className="empty-indicator">Empty</span>}
          {!isEmpty && !isComplete && <span className="partial-indicator">Partial</span>}
          {isComplete && <span className="completion-indicator">Complete</span>}
        </div>
        <span className="expand-icon">{isActive ? '−' : '+'}</span>
      </div>

      {!isActive && !isEmpty && (
        <div className="vto-section-preview">
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            {coreFocus.purpose && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#1976d2' }}>Purpose:</strong> {coreFocus.purpose}
              </div>
            )}
            {coreFocus.niche && (
              <div>
                <strong style={{ color: '#1976d2' }}>Niche:</strong> {coreFocus.niche}
              </div>
            )}
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Define your Purpose (why you exist) and Niche (who you serve).
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to define your core focus
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Your Core Focus consists of your Purpose (why your organization exists) and your Niche (who you serve). 
            Together, they create laser focus for your entire organization.
          </div>

          {/* Purpose Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Purpose - Why do you exist?
            </label>
            <textarea
              value={editingFocus.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Your company's fundamental reason for existing. What impact do you make? What problem do you solve?"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              Example: "To help entrepreneurs get what they want from their business"
            </div>
          </div>

          {/* Niche Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Niche - Who do you serve?
            </label>
            <textarea
              value={editingFocus.niche}
              onChange={(e) => handleChange('niche', e.target.value)}
              placeholder="Your ideal customer segment. Be specific about who you serve best."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              Example: "Growth-oriented entrepreneurs with $1M-$50M companies"
            </div>
          </div>

          {/* Core Focus Statement */}
          {editingFocus.purpose && editingFocus.niche && (
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#e8f5e8',
              border: '1px solid #4caf50',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                Your Core Focus Statement:
              </h5>
              <div style={{ 
                fontSize: '1rem', 
                fontStyle: 'italic',
                color: '#333',
                lineHeight: '1.4'
              }}>
                "{editingFocus.purpose} for {editingFocus.niche}"
              </div>
            </div>
          )}

          {/* Examples */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Core Focus Examples:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>EOS Worldwide:</strong><br/>
              Purpose: "To help entrepreneurs get what they want from their business"<br/>
              Niche: "Growth-oriented entrepreneurs with $1M-$50M companies"<br/><br/>
              
              <strong>TechCorp:</strong><br/>
              Purpose: "To simplify complex technology for everyday users"<br/>
              Niche: "Small businesses without dedicated IT departments"
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>💡 Core Focus Tips:</h5>
            <ul style={{ fontSize: '0.8rem', color: '#666', margin: '0', paddingLeft: '1rem' }}>
              <li>Keep your purpose inspirational but practical</li>
              <li>Be specific about your niche - the riches are in the niches</li>
              <li>Your core focus should fit on a t-shirt</li>
              <li>Everyone in your company should know it by heart</li>
              <li>Use it as a filter for all major decisions</li>
            </ul>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Core Focus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreFocusSection;