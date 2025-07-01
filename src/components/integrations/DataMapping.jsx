import React, { useState } from 'react';
import { useEOS } from '../../context/EOSContext';

const DataMapping = () => {
  const { ghlConfig } = useEOS();
  const [activeMapping, setActiveMapping] = useState('contacts');

  const contactMapping = [
    {
      ghlField: 'firstName',
      eosField: 'name (first part)',
      type: 'Text',
      required: true,
      description: 'Contact first name becomes part of EOS person name'
    },
    {
      ghlField: 'lastName',
      eosField: 'name (last part)',
      type: 'Text',
      required: true,
      description: 'Contact last name becomes part of EOS person name'
    },
    {
      ghlField: 'email',
      eosField: 'email',
      type: 'Email',
      required: false,
      description: 'Primary email address'
    },
    {
      ghlField: 'phone',
      eosField: 'phone',
      type: 'Phone',
      required: false,
      description: 'Primary phone number'
    },
    {
      ghlField: 'tags',
      eosField: 'eosTagged',
      type: 'Boolean',
      required: true,
      description: 'Must have "EOS" tag to be imported'
    },
    {
      ghlField: 'customFields.role',
      eosField: 'role',
      type: 'Text',
      required: true,
      description: 'Job title or position'
    },
    {
      ghlField: 'customFields.seat',
      eosField: 'seat',
      type: 'Select',
      required: true,
      description: 'EOS seat (Visionary, Integrator, Sales, etc.)'
    },
    {
      ghlField: 'customFields.department',
      eosField: 'department',
      type: 'Text',
      required: false,
      description: 'Department or team'
    },
    {
      ghlField: 'dateAdded',
      eosField: 'startDate',
      type: 'Date',
      required: false,
      description: 'When contact was added to GHL'
    }
  ];

  const opportunityMapping = [
    {
      ghlField: 'name',
      eosField: 'title',
      type: 'Text',
      required: true,
      description: 'Opportunity name becomes Rock title'
    },
    {
      ghlField: 'monetaryValue',
      eosField: 'description (appended)',
      type: 'Currency',
      required: false,
      description: 'Value added to Rock description'
    },
    {
      ghlField: 'status',
      eosField: 'progress',
      type: 'Percentage',
      required: true,
      description: 'GHL status mapped to percentage progress'
    },
    {
      ghlField: 'assignedTo',
      eosField: 'owner',
      type: 'Text',
      required: true,
      description: 'Assigned user becomes Rock owner'
    },
    {
      ghlField: 'pipeline',
      eosField: 'priority',
      type: 'Select',
      required: false,
      description: 'Pipeline determines Rock priority'
    },
    {
      ghlField: 'expectedCloseDate',
      eosField: 'dueDate',
      type: 'Date',
      required: true,
      description: 'Close date becomes Rock due date'
    },
    {
      ghlField: 'tags',
      eosField: 'ghlSynced',
      type: 'Boolean',
      required: true,
      description: 'Must have "EOS" tag to be imported'
    },
    {
      ghlField: 'notes',
      eosField: 'description',
      type: 'Text',
      required: false,
      description: 'Opportunity notes become Rock description'
    }
  ];

  const statusMapping = [
    { ghlStatus: 'open', eosProgress: 0, description: 'Just started' },
    { ghlStatus: 'proposal', eosProgress: 25, description: 'Proposal stage' },
    { ghlStatus: 'negotiation', eosProgress: 50, description: 'In negotiation' },
    { ghlStatus: 'verbal_approval', eosProgress: 75, description: 'Verbal approval received' },
    { ghlStatus: 'won', eosProgress: 100, description: 'Opportunity won/completed' },
    { ghlStatus: 'lost', eosProgress: 0, description: 'Opportunity lost (not synced)' }
  ];

  const priorityMapping = [
    { ghlPipeline: 'Hot Leads', eosPriority: 'high', description: 'High priority Rocks' },
    { ghlPipeline: 'Warm Leads', eosPriority: 'medium', description: 'Medium priority Rocks' },
    { ghlPipeline: 'Cold Leads', eosPriority: 'low', description: 'Low priority Rocks' },
    { ghlPipeline: 'Default', eosPriority: 'medium', description: 'Default priority' }
  ];

  return (
    <div className="data-mapping">
      <div className="mapping-header">
        <h4>🔗 Data Mapping Configuration</h4>
        <p>See how data flows between GoHighLevel and your EOS platform</p>
      </div>

      {/* Mapping Type Selector */}
      <div className="mapping-selector">
        <button
          className={`mapping-tab ${activeMapping === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveMapping('contacts')}
        >
          👥 Contacts → People
        </button>
        <button
          className={`mapping-tab ${activeMapping === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveMapping('opportunities')}
        >
          🎯 Opportunities → Rocks
        </button>
        <button
          className={`mapping-tab ${activeMapping === 'status' ? 'active' : ''}`}
          onClick={() => setActiveMapping('status')}
        >
          📊 Status Mapping
        </button>
      </div>

      {/* Contact Mapping */}
      {activeMapping === 'contacts' && (
        <div className="mapping-content">
          <div className="mapping-description">
            <h5>👥 Contact to People Mapping</h5>
            <p>
              GoHighLevel contacts tagged with "EOS" are imported as team members in your EOS People section.
              The GWC (Get it, Want it, Capacity) assessment will need to be completed manually in EOS.
            </p>
          </div>

          <div className="mapping-table">
            <div className="table-header">
              <div>GoHighLevel Field</div>
              <div>EOS Field</div>
              <div>Type</div>
              <div>Required</div>
              <div>Description</div>
            </div>

            {contactMapping.map((mapping, index) => (
              <div key={index} className="table-row">
                <div className="field-name ghl">{mapping.ghlField}</div>
                <div className="field-name eos">{mapping.eosField}</div>
                <div className="field-type">{mapping.type}</div>
                <div className={`field-required ${mapping.required ? 'required' : 'optional'}`}>
                  {mapping.required ? '✅ Required' : '⚪ Optional'}
                </div>
                <div className="field-description">{mapping.description}</div>
              </div>
            ))}
          </div>

          <div className="mapping-notes">
            <h6>📝 Important Notes:</h6>
            <ul>
              <li>Contacts must have the "EOS" tag to be synchronized</li>
              <li>Custom fields in GHL should be created for role, seat, and department</li>
              <li>GWC assessment (Get it, Want it, Capacity) must be completed in EOS</li>
              <li>Changes to contacts in either system will sync both ways</li>
            </ul>
          </div>
        </div>
      )}

      {/* Opportunity Mapping */}
      {activeMapping === 'opportunities' && (
        <div className="mapping-content">
          <div className="mapping-description">
            <h5>🎯 Opportunity to Rocks Mapping</h5>
            <p>
              GoHighLevel opportunities tagged with "EOS" are imported as 90-day priority Rocks.
              The opportunity progress and timeline translate to Rock progress and due dates.
            </p>
          </div>

          <div className="mapping-table">
            <div className="table-header">
              <div>GoHighLevel Field</div>
              <div>EOS Field</div>
              <div>Type</div>
              <div>Required</div>
              <div>Description</div>
            </div>

            {opportunityMapping.map((mapping, index) => (
              <div key={index} className="table-row">
                <div className="field-name ghl">{mapping.ghlField}</div>
                <div className="field-name eos">{mapping.eosField}</div>
                <div className="field-type">{mapping.type}</div>
                <div className={`field-required ${mapping.required ? 'required' : 'optional'}`}>
                  {mapping.required ? '✅ Required' : '⚪ Optional'}
                </div>
                <div className="field-description">{mapping.description}</div>
              </div>
            ))}
          </div>

          <div className="mapping-notes">
            <h6>📝 Important Notes:</h6>
            <ul>
              <li>Opportunities must have the "EOS" tag to be synchronized</li>
              <li>Expected close date should be within 90 days for proper Rock management</li>
              <li>Rock progress updates in EOS will update opportunity status in GHL</li>
              <li>Completed Rocks (100% progress) mark opportunities as "Won" in GHL</li>
            </ul>
          </div>
        </div>
      )}

      {/* Status Mapping */}
      {activeMapping === 'status' && (
        <div className="mapping-content">
          <div className="mapping-description">
            <h5>📊 Status and Priority Mapping</h5>
            <p>
              Configure how GoHighLevel statuses and pipelines map to EOS Rock progress and priorities.
            </p>
          </div>

          <div className="status-section">
            <h6>🔄 Opportunity Status → Rock Progress</h6>
            <div className="mapping-table">
              <div className="table-header">
                <div>GHL Status</div>
                <div>EOS Progress</div>
                <div>Description</div>
              </div>

              {statusMapping.map((mapping, index) => (
                <div key={index} className="table-row">
                  <div className="status-badge ghl">{mapping.ghlStatus}</div>
                  <div className="progress-badge">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${mapping.eosProgress}%` }}
                      />
                    </div>
                    <span>{mapping.eosProgress}%</span>
                  </div>
                  <div className="field-description">{mapping.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="priority-section">
            <h6>📋 Pipeline → Rock Priority</h6>
            <div className="mapping-table">
              <div className="table-header">
                <div>GHL Pipeline</div>
                <div>EOS Priority</div>
                <div>Description</div>
              </div>

              {priorityMapping.map((mapping, index) => (
                <div key={index} className="table-row">
                  <div className="pipeline-badge">{mapping.ghlPipeline}</div>
                  <div className={`priority-badge ${mapping.eosPriority}`}>
                    {mapping.eosPriority}
                  </div>
                  <div className="field-description">{mapping.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mapping-notes">
            <h6>📝 Sync Behavior:</h6>
            <ul>
              <li><strong>Two-way sync:</strong> Changes in either system update the other</li>
              <li><strong>Real-time updates:</strong> Webhooks provide instant synchronization</li>
              <li><strong>Conflict resolution:</strong> Most recent change takes precedence</li>
              <li><strong>Data validation:</strong> Invalid data is logged and skipped</li>
            </ul>
          </div>
        </div>
      )}

      {/* Sync Direction Indicator */}
      <div className="sync-direction">
        <h5>🔄 Synchronization Flow</h5>
        <div className="flow-diagram">
          <div className="flow-item">
            <div className="system-box ghl">
              <strong>GoHighLevel</strong>
              <div>Contacts & Opportunities</div>
            </div>
          </div>
          
          <div className="flow-arrow">
            <span>↔️</span>
            <div className="arrow-label">Two-way sync</div>
          </div>
          
          <div className="flow-item">
            <div className="system-box eos">
              <strong>EOS Platform</strong>
              <div>People & Rocks</div>
            </div>
          </div>
        </div>
        
        <div className="sync-triggers">
          <div className="trigger-item">
            <strong>Manual Sync:</strong> Click "Sync Now" to force synchronization
          </div>
          <div className="trigger-item">
            <strong>Webhook Sync:</strong> Automatic sync when data changes in GHL
          </div>
          <div className="trigger-item">
            <strong>Scheduled Sync:</strong> Hourly background sync for data consistency
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMapping;