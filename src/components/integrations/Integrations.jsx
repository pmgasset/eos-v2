import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import GoHighLevelConfig from './GoHighLevelConfig';
import SyncStatus from './SyncStatus';
import SyncHistory from './SyncHistory';
import DataMapping from './DataMapping';
import '../../styles/Integrations.css';

const Integrations = () => {
  const { ghlConfig, dispatch } = useEOS();
  const [activeTab, setActiveTab] = useState('config');
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  const tabs = [
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'sync', label: 'Sync Status', icon: '🔄' },
    { id: 'mapping', label: 'Data Mapping', icon: '🔗' },
    { id: 'history', label: 'Sync History', icon: '📋' }
  ];

  const handleManualSync = async () => {
    if (!ghlConfig.isConnected) {
      alert('Please configure GoHighLevel connection first');
      return;
    }

    setSyncInProgress(true);
    try {
      // Call sync API
      const response = await fetch('/api/ghl/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: ghlConfig.apiKey,
          locationId: ghlConfig.locationId,
          syncContacts: ghlConfig.syncContacts,
          syncOpportunities: ghlConfig.syncOpportunities,
          eosTagRequired: ghlConfig.eosTagRequired
        })
      });

      const result = await response.json();
      setLastSyncResult(result);
      
      // Update last sync time
      dispatch({
        type: 'UPDATE_GHL_CONFIG',
        payload: { lastSync: new Date().toISOString() }
      });

    } catch (error) {
      console.error('Sync failed:', error);
      setLastSyncResult({
        success: false,
        error: error.message,
        contactsImported: 0,
        opportunitiesImported: 0
      });
    } finally {
      setSyncInProgress(false);
    }
  };

  return (
    <div className="integrations">
      <div className="section-header">
        <h2>Integrations</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className={`connection-status ${ghlConfig.isConnected ? 'connected' : 'disconnected'}`}>
            <span>{ghlConfig.isConnected ? '🟢' : '🔴'}</span>
            <span>{ghlConfig.isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
          {ghlConfig.isConnected && (
            <button 
              className="btn btn-primary"
              onClick={handleManualSync}
              disabled={syncInProgress}
            >
              {syncInProgress ? '🔄 Syncing...' : '🔄 Sync Now'}
            </button>
          )}
        </div>
      </div>

      {/* GoHighLevel Integration Card */}
      <div className="integration-card">
        <div className="integration-header">
          <div className="integration-info">
            <h3>🎯 GoHighLevel CRM</h3>
            <p>Sync contacts and opportunities with your EOS platform</p>
          </div>
          <div className="integration-status">
            {ghlConfig.isConnected ? (
              <span className="status-badge connected">Connected</span>
            ) : (
              <span className="status-badge disconnected">Not Connected</span>
            )}
          </div>
        </div>

        {/* Sync Summary */}
        {ghlConfig.isConnected && (
          <div className="sync-summary">
            <div className="sync-stat">
              <span className="stat-label">Last Sync:</span>
              <span className="stat-value">
                {ghlConfig.lastSync 
                  ? new Date(ghlConfig.lastSync).toLocaleString()
                  : 'Never'
                }
              </span>
            </div>
            <div className="sync-stat">
              <span className="stat-label">Sync Settings:</span>
              <span className="stat-value">
                {ghlConfig.syncContacts && 'Contacts'}
                {ghlConfig.syncContacts && ghlConfig.syncOpportunities && ' • '}
                {ghlConfig.syncOpportunities && 'Opportunities'}
                {ghlConfig.eosTagRequired && ' (EOS Tagged Only)'}
              </span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'config' && (
            <GoHighLevelConfig />
          )}
          
          {activeTab === 'sync' && (
            <SyncStatus 
              syncInProgress={syncInProgress}
              lastSyncResult={lastSyncResult}
              onManualSync={handleManualSync}
            />
          )}
          
          {activeTab === 'mapping' && (
            <DataMapping />
          )}
          
          {activeTab === 'history' && (
            <SyncHistory />
          )}
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="integration-benefits">
        <h3>🚀 Integration Benefits</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h4>👥 People Sync</h4>
            <p>Import GHL contacts tagged with 'EOS' as team members. Keep your people data synchronized between systems.</p>
          </div>
          <div className="benefit-card">
            <h4>🎯 Opportunities as Rocks</h4>
            <p>Transform GHL opportunities into EOS Rocks (90-day priorities). Track progress on both platforms.</p>
          </div>
          <div className="benefit-card">
            <h4>🔄 Two-Way Sync</h4>
            <p>Changes made in either system automatically update the other, keeping your data consistent.</p>
          </div>
          <div className="benefit-card">
            <h4>🏷️ Smart Filtering</h4>
            <p>Only sync data tagged with 'EOS' to keep your EOS platform focused and organized.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;