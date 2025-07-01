import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';

const SyncStatus = ({ syncInProgress, lastSyncResult, onManualSync }) => {
  const { ghlConfig, people, rocks } = useEOS();
  const [syncStats, setSyncStats] = useState({
    totalContacts: 0,
    syncedPeople: 0,
    totalOpportunities: 0,
    syncedRocks: 0,
    lastSyncDuration: null
  });

  useEffect(() => {
    // Calculate sync statistics
    const eosTaggedPeople = people.filter(p => p.ghlId && p.eosTagged);
    const ghlSyncedRocks = rocks.filter(r => r.ghlOpportunityId);

    setSyncStats({
      syncedPeople: eosTaggedPeople.length,
      syncedRocks: ghlSyncedRocks.length,
      lastSyncDuration: lastSyncResult?.duration || null
    });
  }, [people, rocks, lastSyncResult]);

  const getTimeSinceLastSync = () => {
    if (!ghlConfig.lastSync) return 'Never';
    
    const now = new Date();
    const lastSync = new Date(ghlConfig.lastSync);
    const diffMs = now - lastSync;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getSyncStatusColor = () => {
    if (syncInProgress) return '#2196f3';
    if (!ghlConfig.lastSync) return '#ff9800';
    
    const now = new Date();
    const lastSync = new Date(ghlConfig.lastSync);
    const hoursSinceSync = (now - lastSync) / 3600000;
    
    if (hoursSinceSync < 24) return '#4caf50';
    if (hoursSinceSync < 72) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="sync-status">
      {/* Current Status */}
      <div className="status-overview">
        <div className="status-card">
          <div className="status-header">
            <h4>🔄 Sync Status</h4>
            <div 
              className="status-indicator"
              style={{ 
                backgroundColor: getSyncStatusColor(),
                width: '12px',
                height: '12px',
                borderRadius: '50%'
              }}
            />
          </div>
          <div className="status-details">
            <div className="status-item">
              <span className="label">Last Sync:</span>
              <span className="value">{getTimeSinceLastSync()}</span>
            </div>
            <div className="status-item">
              <span className="label">Connection:</span>
              <span className={`value ${ghlConfig.isConnected ? 'connected' : 'disconnected'}`}>
                {ghlConfig.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
            {syncInProgress && (
              <div className="status-item">
                <span className="label">Status:</span>
                <span className="value syncing">🔄 Syncing in progress...</span>
              </div>
            )}
          </div>
        </div>

        <div className="sync-actions">
          <button
            className="btn btn-primary"
            onClick={onManualSync}
            disabled={!ghlConfig.isConnected || syncInProgress}
          >
            {syncInProgress ? '🔄 Syncing...' : '🔄 Manual Sync'}
          </button>
          
          {!ghlConfig.isConnected && (
            <div style={{ fontSize: '0.8rem', color: '#f44336', marginTop: '0.5rem' }}>
              Configure connection first
            </div>
          )}
        </div>
      </div>

      {/* Sync Statistics */}
      <div className="sync-stats">
        <h4>📊 Sync Statistics</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{syncStats.syncedPeople}</div>
              <div className="stat-label">People Synced</div>
              <div className="stat-description">
                GHL contacts imported as team members
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{syncStats.syncedRocks}</div>
              <div className="stat-label">Rocks Synced</div>
              <div className="stat-description">
                GHL opportunities imported as 90-day priorities
              </div>
            </div>
          </div>

          {syncStats.lastSyncDuration && (
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-number">{syncStats.lastSyncDuration}s</div>
                <div className="stat-label">Last Sync Duration</div>
                <div className="stat-description">
                  Time taken for last synchronization
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <div className="sync-result">
          <h4>📋 Last Sync Result</h4>
          <div className={`result-summary ${lastSyncResult.success ? 'success' : 'error'}`}>
            <div className="result-header">
              <span className="result-icon">
                {lastSyncResult.success ? '✅' : '❌'}
              </span>
              <span className="result-text">
                {lastSyncResult.success ? 'Sync Completed Successfully' : 'Sync Failed'}
              </span>
              <span className="result-time">
                {new Date(lastSyncResult.timestamp || Date.now()).toLocaleString()}
              </span>
            </div>

            {lastSyncResult.success ? (
              <div className="result-details">
                <div className="result-item">
                  <span className="label">Contacts Imported:</span>
                  <span className="value">{lastSyncResult.contactsImported || 0}</span>
                </div>
                <div className="result-item">
                  <span className="label">Opportunities Imported:</span>
                  <span className="value">{lastSyncResult.opportunitiesImported || 0}</span>
                </div>
                <div className="result-item">
                  <span className="label">People Updated:</span>
                  <span className="value">{lastSyncResult.peopleUpdated || 0}</span>
                </div>
                <div className="result-item">
                  <span className="label">Rocks Updated:</span>
                  <span className="value">{lastSyncResult.rocksUpdated || 0}</span>
                </div>
                {lastSyncResult.warnings && lastSyncResult.warnings.length > 0 && (
                  <div className="result-warnings">
                    <strong>Warnings:</strong>
                    <ul>
                      {lastSyncResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="result-error">
                <strong>Error:</strong> {lastSyncResult.error || 'Unknown error occurred'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sync Settings Summary */}
      <div className="sync-settings">
        <h4>⚙️ Current Sync Settings</h4>
        <div className="settings-list">
          <div className="setting-item">
            <span className="setting-label">Sync Contacts:</span>
            <span className={`setting-value ${ghlConfig.syncContacts ? 'enabled' : 'disabled'}`}>
              {ghlConfig.syncContacts ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Sync Opportunities:</span>
            <span className={`setting-value ${ghlConfig.syncOpportunities ? 'enabled' : 'disabled'}`}>
              {ghlConfig.syncOpportunities ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">EOS Tag Required:</span>
            <span className={`setting-value ${ghlConfig.eosTagRequired ? 'enabled' : 'disabled'}`}>
              {ghlConfig.eosTagRequired ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Webhook URL:</span>
            <span className="setting-value">
              {ghlConfig.webhookUrl ? '✅ Configured' : '❌ Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {!ghlConfig.isConnected && (
        <div className="next-steps">
          <h4>🚀 Next Steps</h4>
          <ol>
            <li>Complete the API configuration in the Configuration tab</li>
            <li>Test your connection to ensure it works properly</li>
            <li>Configure your sync settings (contacts, opportunities, tags)</li>
            <li>Run your first manual sync to import data</li>
            <li>Set up webhooks for real-time synchronization</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default SyncStatus;