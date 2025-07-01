import React, { useState } from 'react';
import { useEOS } from '../../context/EOSContext';
import { GHL_WEBHOOK } from '../../utils/constants';

const GoHighLevelConfig = () => {
  const { ghlConfig, dispatch } = useEOS();
  const [formData, setFormData] = useState({
    apiKey: ghlConfig.apiKey || '',
    locationId: ghlConfig.locationId || '',
    syncContacts: ghlConfig.syncContacts,
    syncOpportunities: ghlConfig.syncOpportunities,
    eosTagRequired: ghlConfig.eosTagRequired
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const testConnection = async () => {
    if (!formData.apiKey || !formData.locationId) {
      setTestResult({
        success: false,
        message: 'Please enter both API Key and Location ID'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test API connection
      const response = await fetch('/api/ghl/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: formData.apiKey,
          locationId: formData.locationId
        })
      });

      const result = await response.json();
      setTestResult(result);
      
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection failed: ' + error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = async () => {
    // Save to context/local state
    const configUpdate = {
      ...formData,
      isConnected: testResult?.success || false,
      webhookUrl: GHL_WEBHOOK
    };

    dispatch({
      type: 'UPDATE_GHL_CONFIG',
      payload: configUpdate
    });

    // Setup webhook if connection is successful
    if (testResult?.success) {
      try {
        await fetch('/api/ghl/webhook/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: formData.apiKey,
            locationId: formData.locationId,
            webhookUrl: GHL_WEBHOOK
          })
        });
      } catch (error) {
        console.error('Webhook setup failed:', error);
      }
    }

    alert('Configuration saved successfully!');
  };

  return (
    <div className="ghl-config">
      <div className="config-section">
        <h4>API Configuration</h4>
        <p>Configure your GoHighLevel API connection to enable data synchronization.</p>

        <div className="form-group">
          <label htmlFor="apiKey">
            GoHighLevel API Key *
            <a 
              href="https://marketplace.gohighlevel.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}
            >
              (Get API Key)
            </a>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Enter your GHL API key"
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {showApiKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="locationId">
            Location ID *
            <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
              (Found in GHL Settings → Company)
            </span>
          </label>
          <input
            type="text"
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            placeholder="Enter your GHL Location ID"
          />
        </div>

        <div className="test-connection">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={testConnection}
            disabled={testing || !formData.apiKey || !formData.locationId}
          >
            {testing ? '🔄 Testing...' : '🔍 Test Connection'}
          </button>

          {testResult && (
            <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
              <span className="result-icon">
                {testResult.success ? '✅' : '❌'}
              </span>
              <span className="result-message">{testResult.message}</span>
              {testResult.success && testResult.locationName && (
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                  Connected to: {testResult.locationName}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="config-section">
        <h4>Sync Settings</h4>
        <p>Configure what data to synchronize between GoHighLevel and your EOS platform.</p>

        <div className="sync-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="syncContacts"
              checked={formData.syncContacts}
              onChange={handleChange}
            />
            <div className="checkbox-info">
              <strong>Sync Contacts as People</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Import GHL contacts into EOS People section for team management
              </div>
            </div>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="syncOpportunities"
              checked={formData.syncOpportunities}
              onChange={handleChange}
            />
            <div className="checkbox-info">
              <strong>Sync Opportunities as Rocks</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Import GHL opportunities as 90-day priority Rocks
              </div>
            </div>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="eosTagRequired"
              checked={formData.eosTagRequired}
              onChange={handleChange}
            />
            <div className="checkbox-info">
              <strong>Require 'EOS' Tag</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Only sync contacts and opportunities tagged with 'EOS'
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="config-section">
        <h4>Webhook Configuration</h4>
        <p>Webhook URL for real-time synchronization:</p>
        <div className="webhook-url">
          <code>{GHL_WEBHOOK}</code>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(GHL_WEBHOOK)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              color: '#2196f3'
            }}
          >
            📋 Copy
          </button>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Add this webhook URL in your GoHighLevel settings to enable real-time sync.
        </div>
      </div>

      <div className="config-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveConfiguration}
          disabled={!testResult?.success}
        >
          💾 Save Configuration
        </button>
        
        {!testResult?.success && (
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
            Please test the connection successfully before saving
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="setup-instructions">
        <h4>📋 Setup Instructions</h4>
        <ol>
          <li>
            <strong>Get API Key:</strong> In GoHighLevel, go to Settings → Integrations → API Keys
          </li>
          <li>
            <strong>Find Location ID:</strong> Go to Settings → Company to find your Location ID
          </li>
          <li>
            <strong>Tag Contacts:</strong> Add 'EOS' tag to contacts you want to sync
          </li>
          <li>
            <strong>Setup Webhook:</strong> In GHL, go to Settings → Integrations → Webhooks and add the webhook URL above
          </li>
          <li>
            <strong>Test & Save:</strong> Test your connection and save the configuration
          </li>
        </ol>
      </div>
    </div>
  );
};

export default GoHighLevelConfig;