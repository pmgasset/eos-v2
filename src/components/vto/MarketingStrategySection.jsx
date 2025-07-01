import React, { useState } from 'react';

const MarketingStrategySection = ({ marketingStrategy, onUpdate, isActive, onActivate }) => {
  const [editingStrategy, setEditingStrategy] = useState(marketingStrategy);

  const handleSave = () => {
    onUpdate(editingStrategy);
    onActivate();
  };

  const handleCancel = () => {
    setEditingStrategy(marketingStrategy);
    onActivate();
  };

  const isEmpty = !marketingStrategy;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Marketing Strategy</h4>
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
            {marketingStrategy.length > 150 
              ? `${marketingStrategy.substring(0, 150)}...` 
              : marketingStrategy
            }
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Define how you'll reach and attract your ideal customers.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to define your marketing strategy
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Your Marketing Strategy defines your unique message and how you'll reach your target market. 
            It should align with your Core Focus and drive toward your 10-Year Target.
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Marketing Strategy
            </label>
            <textarea
              value={editingStrategy}
              onChange={(e) => setEditingStrategy(e.target.value)}
              placeholder="Describe your unique value proposition, target market positioning, and key marketing channels. What makes you different? How do customers find you?"
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
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Marketing Strategy Framework:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>1. Unique Value Proposition:</strong> What makes you uniquely different?<br/>
              <strong>2. Target Market:</strong> Who is your ideal customer?<br/>
              <strong>3. Positioning:</strong> How do you want to be perceived?<br/>
              <strong>4. Key Channels:</strong> How do customers find and buy from you?<br/>
              <strong>5. Brand Promise:</strong> What experience do you deliver?
            </div>
          </div>

          {/* Examples */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Example Marketing Strategies:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>B2B Software:</strong><br/>
              "We're the only project management tool built specifically for creative agencies. 
              We reach customers through creative industry publications, design conferences, 
              and referrals from satisfied agencies. Our brand promise: simplify creativity."<br/><br/>
              
              <strong>Local Service Business:</strong><br/>
              "We're the premium home renovation company that guarantees zero surprises. 
              We reach customers through neighborhood referrals, online reviews, and 
              showcasing our work on social media. Our brand promise: your dream home, delivered on time and on budget."
            </div>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Marketing Strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingStrategySection;