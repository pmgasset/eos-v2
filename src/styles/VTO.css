import React, { useState } from 'react';
import { useEOS } from '../../context/EOSContext';
import CoreValuesSection from './CoreValuesSection';
import CoreFocusSection from './CoreFocusSection';
import TenYearTargetSection from './TenYearTargetSection';
import MarketingStrategySection from './MarketingStrategySection';
import ThreeYearPictureSection from './ThreeYearPictureSection';
import OneYearPlanSection from './OneYearPlanSection';

const VTO = () => {
  const { visionData, updateVision } = useEOS();
  const [activeSection, setActiveSection] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSectionUpdate = async (section, data) => {
    const updatedVision = {
      ...visionData,
      [section]: data
    };
    
    try {
      await updateVision(updatedVision);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const getCompletionStatus = () => {
    const sections = [
      { name: 'Core Values', data: visionData.coreValues, isEmpty: !visionData.coreValues || visionData.coreValues.length === 0 },
      { name: 'Core Focus', data: visionData.coreFocus, isEmpty: !visionData.coreFocus?.purpose && !visionData.coreFocus?.niche },
      { name: '10-Year Target', data: visionData.tenYearTarget, isEmpty: !visionData.tenYearTarget },
      { name: 'Marketing Strategy', data: visionData.marketingStrategy, isEmpty: !visionData.marketingStrategy },
      { name: '3-Year Picture', data: visionData.threeYearPicture, isEmpty: !visionData.threeYearPicture },
      { name: '1-Year Plan', data: visionData.oneYearPlan, isEmpty: !visionData.oneYearPlan }
    ];

    const completed = sections.filter(s => !s.isEmpty).length;
    const total = sections.length;
    
    return { completed, total, sections };
  };

  const completionStatus = getCompletionStatus();
  const completionPercentage = Math.round((completionStatus.completed / completionStatus.total) * 100);

  return (
    <div className="vto">
      <div className="section-header">
        <h2>Vision/Traction Organizer (V/TO)</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Vision Complete: {completionStatus.completed}/{completionStatus.total} sections
          </div>
          <div style={{
            width: '100px',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionPercentage}%`,
              height: '100%',
              backgroundColor: completionPercentage >= 100 ? '#4caf50' : 
                             completionPercentage >= 70 ? '#ff9800' : '#f44336',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            color: completionPercentage >= 100 ? '#4caf50' : 
                   completionPercentage >= 70 ? '#ff9800' : '#f44336'
          }}>
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* V/TO Introduction */}
      {completionPercentage < 50 && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0f8ff',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>
            🎯 Welcome to the Vision/Traction Organizer
          </h3>
          <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
            The V/TO is your company's strategic foundation. It clarifies where you're going and how you'll get there.
            Complete each section to create a compelling vision that drives everything in your organization.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: '#1976d2' }}>Vision Side (Where you're going):</strong>
              <ul style={{ margin: '0.5rem 0 0 1rem', color: '#666' }}>
                <li>Core Values - Your fundamental beliefs</li>
                <li>Core Focus - Your purpose and niche</li>
                <li>10-Year Target - Your big inspiring goal</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#1976d2' }}>Traction Side (How you'll get there):</strong>
              <ul style={{ margin: '0.5rem 0 0 1rem', color: '#666' }}>
                <li>Marketing Strategy - How you'll reach customers</li>
                <li>3-Year Picture - Clear 3-year vision</li>
                <li>1-Year Plan - This year's priorities</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* V/TO Grid Layout */}
      <div className="vto-grid">
        {/* Left Column - Vision Side */}
        <div className="vto-column vto-vision">
          <div className="column-header">
            <h3>👁️ Vision (Where you're going)</h3>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Your company's purpose and long-term direction
            </div>
          </div>

          <CoreValuesSection
            coreValues={visionData.coreValues || []}
            onUpdate={(data) => handleSectionUpdate('coreValues', data)}
            isActive={activeSection === 'coreValues'}
            onActivate={() => setActiveSection(activeSection === 'coreValues' ? null : 'coreValues')}
          />

          <CoreFocusSection
            coreFocus={visionData.coreFocus || { purpose: '', niche: '' }}
            onUpdate={(data) => handleSectionUpdate('coreFocus', data)}
            isActive={activeSection === 'coreFocus'}
            onActivate={() => setActiveSection(activeSection === 'coreFocus' ? null : 'coreFocus')}
          />

          <TenYearTargetSection
            tenYearTarget={visionData.tenYearTarget || ''}
            onUpdate={(data) => handleSectionUpdate('tenYearTarget', data)}
            isActive={activeSection === 'tenYearTarget'}
            onActivate={() => setActiveSection(activeSection === 'tenYearTarget' ? null : 'tenYearTarget')}
          />
        </div>

        {/* Right Column - Traction Side */}
        <div className="vto-column vto-traction">
          <div className="column-header">
            <h3>⚡ Traction (How you'll get there)</h3>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Your execution plan and near-term focus
            </div>
          </div>

          <MarketingStrategySection
            marketingStrategy={visionData.marketingStrategy || ''}
            onUpdate={(data) => handleSectionUpdate('marketingStrategy', data)}
            isActive={activeSection === 'marketingStrategy'}
            onActivate={() => setActiveSection(activeSection === 'marketingStrategy' ? null : 'marketingStrategy')}
          />

          <ThreeYearPictureSection
            threeYearPicture={visionData.threeYearPicture || ''}
            onUpdate={(data) => handleSectionUpdate('threeYearPicture', data)}
            isActive={activeSection === 'threeYearPicture'}
            onActivate={() => setActiveSection(activeSection === 'threeYearPicture' ? null : 'threeYearPicture')}
          />

          <OneYearPlanSection
            oneYearPlan={visionData.oneYearPlan || ''}
            onUpdate={(data) => handleSectionUpdate('oneYearPlan', data)}
            isActive={activeSection === 'oneYearPlan'}
            onActivate={() => setActiveSection(activeSection === 'oneYearPlan' ? null : 'oneYearPlan')}
          />
        </div>
      </div>

      {/* Vision Summary */}
      {completionPercentage >= 70 && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#e8f5e8',
          border: '1px solid #4caf50',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
            ✅ Vision Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: '#2e7d32' }}>Core Focus:</strong>
              <div style={{ color: '#666', marginBottom: '1rem' }}>
                {visionData.coreFocus?.purpose && visionData.coreFocus?.niche 
                  ? `${visionData.coreFocus.purpose} for ${visionData.coreFocus.niche}`
                  : 'Not yet defined'
                }
              </div>
              
              <strong style={{ color: '#2e7d32' }}>Core Values:</strong>
              <div style={{ color: '#666' }}>
                {visionData.coreValues && visionData.coreValues.length > 0
                  ? visionData.coreValues.map(v => v.name).join(', ')
                  : 'Not yet defined'
                }
              </div>
            </div>
            <div>
              <strong style={{ color: '#2e7d32' }}>10-Year Target:</strong>
              <div style={{ color: '#666', marginBottom: '1rem' }}>
                {visionData.tenYearTarget || 'Not yet defined'}
              </div>
              
              <strong style={{ color: '#2e7d32' }}>This Year's Focus:</strong>
              <div style={{ color: '#666' }}>
                {visionData.oneYearPlan || 'Not yet defined'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VTO;