import React, { useState } from 'react';

const CoreValuesSection = ({ coreValues, onUpdate, isActive, onActivate }) => {
  const [editingValues, setEditingValues] = useState(coreValues);

  const handleSave = () => {
    onUpdate(editingValues);
    onActivate();
  };

  const handleCancel = () => {
    setEditingValues(coreValues);
    onActivate();
  };

  const addValue = () => {
    setEditingValues([...editingValues, { name: '', description: '' }]);
  };

  const removeValue = (index) => {
    setEditingValues(editingValues.filter((_, i) => i !== index));
  };

  const updateValue = (index, field, value) => {
    const updated = [...editingValues];
    updated[index] = { ...updated[index], [field]: value };
    setEditingValues(updated);
  };

  const isEmpty = !coreValues || coreValues.length === 0;

  return (
    <div className="vto-section">
      <div 
        className="vto-section-header"
        onClick={onActivate}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Core Values</h4>
          {isEmpty && <span className="empty-indicator">Empty</span>}
          {!isEmpty && <span className="completion-indicator">Complete</span>}
        </div>
        <span className="expand-icon">{isActive ? '−' : '+'}</span>
      </div>

      {!isActive && !isEmpty && (
        <div className="vto-section-preview">
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            {coreValues.map((value, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>
                <strong>{value.name}</strong>
                {value.description && ` - ${value.description.substring(0, 50)}${value.description.length > 50 ? '...' : ''}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isActive && isEmpty && (
        <div className="vto-section-empty">
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Define 3-7 fundamental beliefs that guide your organization.
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Click to define your core values
          </div>
        </div>
      )}

      {isActive && (
        <div className="vto-section-content">
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            Core Values are the fundamental beliefs that guide your organization's behavior and decision-making. 
            They should be 3-7 values that you hire, fire, review, and reward around.
          </div>

          {editingValues.map((value, index) => (
            <div key={index} style={{ 
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h5 style={{ margin: 0 }}>Core Value #{index + 1}</h5>
                {editingValues.length > 1 && (
                  <button
                    onClick={() => removeValue(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={value.name}
                  onChange={(e) => updateValue(index, 'name', e.target.value)}
                  placeholder="Value name (e.g., Integrity, Excellence, Fun)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <textarea
                value={value.description}
                onChange={(e) => updateValue(index, 'description', e.target.value)}
                placeholder="Brief description of what this value means and how it shows up in your organization"
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>
          ))}

          <button
            onClick={addValue}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            + Add Core Value
          </button>

          {/* Examples */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Example Core Values:</h5>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4' }}>
              <strong>Integrity:</strong> We do the right thing, even when no one is watching<br/>
              <strong>Excellence:</strong> We strive to exceed expectations in everything we do<br/>
              <strong>Fun:</strong> We enjoy our work and celebrate our successes<br/>
              <strong>Teamwork:</strong> We achieve more together than we ever could alone
            </div>
          </div>

          {/* Tips */}
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>💡 Core Values Tips:</h5>
            <ul style={{ fontSize: '0.8rem', color: '#666', margin: '0', paddingLeft: '1rem' }}>
              <li>Keep it to 3-7 values maximum</li>
              <li>Use single words or short phrases</li>
              <li>Make them memorable and actionable</li>
              <li>They should feel authentic to your organization</li>
              <li>Use them in hiring, firing, reviewing, and rewarding</li>
            </ul>
          </div>

          <div className="vto-section-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Core Values
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreValuesSection;