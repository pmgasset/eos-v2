import React from 'react';
import { useEOS } from '../../context/EOSContext';

const Navigation = () => {
  const { currentView, apiStatus, dispatch } = useEOS();

  const navItems = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'scorecard', label: '📈 Scorecard' },
    { key: 'rocks', label: '🎯 Rocks' },
    { key: 'issues', label: '⚠️ Issues' },
    { key: 'vto', label: '👁️ V/TO' },
    { key: 'l10', label: '📅 L10 Meetings' },
    { key: 'people', label: '👥 People' },
    { key: 'integrations', label: '🔗 Integrations' }
  ];

  return (
    <nav className="eos-nav">
      <div className="nav-brand">
        <h1>HeptagonIT EOS Platform</h1>
        <div className={`api-status ${apiStatus}`}>
          <span>{apiStatus === 'connected' ? '🟢' : apiStatus === 'error' ? '🔴' : '🟡'}</span>
          <span>{apiStatus}</span>
        </div>
      </div>
      <div className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-item ${currentView === item.key ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.key })}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;