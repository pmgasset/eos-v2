import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';

const SyncHistory = () => {
  const { ghlConfig } = useEOS();
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, success, error
  const [selectedSync, setSelectedSync] = useState(null);

  useEffect(() => {
    loadSyncHistory();
  }, []);

  const loadSyncHistory = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll use mock data
      const mockHistory = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          type: 'manual',
          success: true,
          duration: 45,
          contactsImported: 12,
          opportunitiesImported: 8,
          peopleUpdated: 3,
          rocksUpdated: 5,
          warnings: ['Contact "John Doe" missing seat information'],
          details: 'Manual sync initiated by user'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          type: 'webhook',
          success: true,
          duration: 12,
          contactsImported: 2,
          opportunitiesImported: 1,
          peopleUpdated: 2,
          rocksUpdated: 1,
          warnings: [],
          details: 'Webhook triggered by GHL opportunity update'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          type: 'scheduled',
          success: false,
          duration: 8,
          error: 'API rate limit exceeded',
          details: 'Scheduled hourly sync failed due to rate limiting'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          type: 'manual',
          success: true,
          duration: 67,
          contactsImported: 25,
          opportunitiesImported: 15,
          peopleUpdated: 8,
          rocksUpdated: 12,
          warnings: [
            'Opportunity "Q4 Sales Target" has no assigned owner',
            'Contact "Jane Smith" has invalid phone number format'
          ],
          details: 'Initial sync after configuration'
        }
      ];
      
      setSyncHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = syncHistory.filter(sync => {
    if (filter === 'success') return sync.success;
    if (filter === 'error') return !sync.success;
    return true;
  });

  const getSyncTypeIcon = (type) => {
    const icons = {
      manual: '👤',
      webhook: '🔗',
      scheduled: '⏰'
    };
    return icons[type] || '🔄';
  };

  const getSyncTypeLabel = (type) => {
    const labels = {
      manual: 'Manual Sync',
      webhook: 'Webhook Sync',
      scheduled: 'Scheduled Sync'
    };
    return labels[type] || 'Unknown';
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTotalStats = () => {
    const successfulSyncs = syncHistory.filter(s => s.success);
    return {
      totalSyncs: syncHistory.length,
      successfulSyncs: successfulSyncs.length,
      totalContactsImported: successfulSyncs.reduce((sum, s) => sum + (s.contactsImported || 0), 0),
      totalOpportunitiesImported: successfulSyncs.reduce((sum, s) => sum + (s.opportunitiesImported || 0), 0),
      avgDuration: successfulSyncs.length > 0 
        ? Math.round(successfulSyncs.reduce((sum, s) => sum + s.duration, 0) / successfulSyncs.length)
        : 0
    };
  };

  const stats = getTotalStats();

  return (
    <div className="sync-history">
      <div className="history-header">
        <h4>📋 Sync History</h4>
        <p>Review past synchronization activities and their results</p>
      </div>

      {/* Summary Stats */}
      <div className="history-stats">
        <div className="stat-item">
          <div className="stat-number">{stats.totalSyncs}</div>
          <div className="stat-label">Total Syncs</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.successfulSyncs}</div>
          <div className="stat-label">Successful</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.totalContactsImported}</div>
          <div className="stat-label">Contacts Imported</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.totalOpportunitiesImported}</div>
          <div className="stat-label">Opportunities Imported</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.avgDuration}s</div>
          <div className="stat-label">Avg Duration</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="history-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Syncs
          </button>
          <button
            className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
            onClick={() => setFilter('success')}
          >
            ✅ Successful
          </button>
          <button
            className={`filter-btn ${filter === 'error' ? 'active' : ''}`}
            onClick={() => setFilter('error')}
          >
            ❌ Failed
          </button>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadSyncHistory}
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* History List */}
      <div className="history-list">
        {loading ? (
          <div className="loading-state">
            <div>🔄 Loading sync history...</div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div>📭 No sync history found</div>
            <p>Sync history will appear here after your first synchronization</p>
          </div>
        ) : (
          filteredHistory.map(sync => (
            <div key={sync.id} className={`history-item ${sync.success ? 'success' : 'error'}`}>
              <div className="history-summary" onClick={() => setSelectedSync(selectedSync === sync.id ? null : sync.id)}>
                <div className="summary-left">
                  <div className="sync-icon">{getSyncTypeIcon(sync.type)}</div>
                  <div className="sync-info">
                    <div className="sync-type">{getSyncTypeLabel(sync.type)}</div>
                    <div className="sync-time">{formatTimestamp(sync.timestamp)}</div>
                  </div>
                </div>

                <div className="summary-middle">
                  {sync.success ? (
                    <div className="sync-results">
                      <span className="result-item">👥 {sync.contactsImported || 0}</span>
                      <span className="result-item">🎯 {sync.opportunitiesImported || 0}</span>
                      <span className="duration">⏱️ {formatDuration(sync.duration)}</span>
                    </div>
                  ) : (
                    <div className="sync-error">
                      <span className="error-text">❌ {sync.error}</span>
                    </div>
                  )}
                </div>

                <div className="summary-right">
                  <div className={`status-indicator ${sync.success ? 'success' : 'error'}`}>
                    {sync.success ? '✅' : '❌'}
                  </div>
                  <div className="expand-icon">
                    {selectedSync === sync.id ? '⌄' : '›'}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedSync === sync.id && (
                <div className="history-details">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h6>📊 Results</h6>
                      <div className="detail-items">
                        {sync.success ? (
                          <>
                            <div className="detail-item">
                              <span className="label">Contacts Imported:</span>
                              <span className="value">{sync.contactsImported || 0}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Opportunities Imported:</span>
                              <span className="value">{sync.opportunitiesImported || 0}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">People Updated:</span>
                              <span className="value">{sync.peopleUpdated || 0}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Rocks Updated:</span>
                              <span className="value">{sync.rocksUpdated || 0}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Duration:</span>
                              <span className="value">{formatDuration(sync.duration)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="detail-item error">
                            <span className="label">Error:</span>
                            <span className="value">{sync.error}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h6>ℹ️ Details</h6>
                      <div className="detail-description">
                        {sync.details}
                      </div>
                      <div className="detail-timestamp">
                        <strong>Timestamp:</strong> {new Date(sync.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {sync.warnings && sync.warnings.length > 0 && (
                    <div className="warnings-section">
                      <h6>⚠️ Warnings</h6>
                      <div className="warnings-list">
                        {sync.warnings.map((warning, index) => (
                          <div key={index} className="warning-item">
                            <span className="warning-icon">⚠️</span>
                            <span className="warning-text">{warning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Clear History Option */}
      {syncHistory.length > 0 && (
        <div className="history-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all sync history? This action cannot be undone.')) {
                setSyncHistory([]);
              }
            }}
          >
            🗑️ Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default SyncHistory;