import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';
import IssuesTable from './IssuesTable';
import IssueForm from './IssueForm';
import Modal from '../common/Modal';

const Issues = () => {
  const { issues } = useEOS();
  const { showModal, modalType, modalData, openModal, closeModal } = useModal();

  const handleAddIssue = () => {
    openModal('issue');
  };

  const handleEditIssue = (issue) => {
    openModal('issue', issue);
  };

  const getIssueStats = () => {
    const total = issues.length;
    const identified = issues.filter(i => i.status === 'identified').length;
    const discussed = issues.filter(i => i.status === 'discussed').length;
    const solved = issues.filter(i => i.status === 'solved').length;
    const highPriority = issues.filter(i => i.priority === 'high').length;
    const avgResolutionDays = getAverageResolutionTime();

    return { total, identified, discussed, solved, highPriority, avgResolutionDays };
  };

  const getAverageResolutionTime = () => {
    const solvedIssues = issues.filter(i => i.status === 'solved' && i.resolvedDate && i.createdDate);
    if (solvedIssues.length === 0) return 0;

    const totalDays = solvedIssues.reduce((sum, issue) => {
      const created = new Date(issue.createdDate);
      const resolved = new Date(issue.resolvedDate);
      const days = Math.ceil((resolved - created) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / solvedIssues.length);
  };

  const stats = getIssueStats();

  return (
    <div className="issues">
      <div className="section-header">
        <h2>Issues List - Identify, Discuss, Solve</h2>
        <button className="btn btn-primary" onClick={handleAddIssue}>
          + Add Issue
        </button>
      </div>

      {issues.length > 0 && (
        <div className="issues-stats">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <h3>Total Issues</h3>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">{stats.highPriority} High Priority</div>
            </div>
            <div className="stat-card">
              <h3>Identified</h3>
              <div className="stat-number">{stats.identified}</div>
              <div className="stat-label">Need Discussion</div>
            </div>
            <div className="stat-card">
              <h3>In Discussion</h3>
              <div className="stat-number">{stats.discussed}</div>
              <div className="stat-label">Working Toward Solution</div>
            </div>
            <div className="stat-card">
              <h3>Solved</h3>
              <div className="stat-number">{stats.solved}</div>
              <div className="stat-label">
                {stats.avgResolutionDays > 0 ? `Avg: ${stats.avgResolutionDays} days` : 'Recently Solved'}
              </div>
            </div>
          </div>
        </div>
      )}

      {issues.length === 0 ? (
        <div className="empty-section">
          <h3>No issues identified yet</h3>
          <p>Use the Issues List to identify, discuss, and solve problems that arise in your business.</p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>The IDS Process:</h4>
            <ul style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <li><strong>Identify:</strong> Clearly state the issue</li>
              <li><strong>Discuss:</strong> Get to the root cause</li>
              <li><strong>Solve:</strong> Agree on specific action steps</li>
            </ul>
          </div>
          <button className="btn btn-primary" onClick={handleAddIssue}>
            Add First Issue
          </button>
        </div>
      ) : (
        <IssuesTable 
          issues={issues} 
          onEditIssue={handleEditIssue}
        />
      )}

      <Modal
        show={showModal && modalType === 'issue'}
        onClose={closeModal}
        title={modalData ? 'Edit Issue' : 'Add New Issue'}
        size="lg"
      >
        <IssueForm
          initialData={modalData}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Issues;