import React from 'react';
import { useEOS } from '../../context/EOSContext';

const IssuesTable = ({ issues, onEditIssue }) => {
  const { deleteItem, updateItem } = useEOS();

  const getStatusLabel = (status) => {
    const labels = {
      'identified': 'Identified',
      'discussed': 'Discussed',
      'solved': 'Solved'
    };
    return labels[status] || 'Unknown';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#f44336',
      'medium': '#ff9800',
      'low': '#4caf50'
    };
    return colors[priority] || '#666';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysOld = (createdDate) => {
    if (!createdDate) return 0;
    const now = new Date();
    const created = new Date(createdDate);
    return Math.ceil((now - created) / (1000 * 60 * 60 * 24));
  };

  const getResolutionTime = (createdDate, resolvedDate) => {
    if (!createdDate || !resolvedDate) return null;
    const created = new Date(createdDate);
    const resolved = new Date(resolvedDate);
    const days = Math.ceil((resolved - created) / (1000 * 60 * 60 * 24));
    return days === 1 ? '1 day' : `${days} days`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await deleteItem('issue', id);
    }
  };

  const handleStatusChange = async (issue, newStatus) => {
    const updatedIssue = {
      ...issue,
      status: newStatus
    };

    // Add resolved date when moving to solved
    if (newStatus === 'solved' && issue.status !== 'solved') {
      updatedIssue.resolvedDate = new Date().toISOString();
    }

    // Remove resolved date if moving away from solved
    if (newStatus !== 'solved' && issue.status === 'solved') {
      updatedIssue.resolvedDate = null;
    }

    await updateItem('issue', issue.id, updatedIssue);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'identified': 'discussed',
      'discussed': 'solved',
      'solved': 'identified'
    };
    return statusFlow[currentStatus] || 'identified';
  };

  const getStatusButtonText = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    const buttonText = {
      'identified': 'Move to Discuss',
      'discussed': 'Mark Solved',
      'solved': 'Reopen'
    };
    return buttonText[currentStatus] || 'Update Status';
  };

  // Sort issues: high priority first, then by status (identified -> discussed -> solved), then by date
  const sortedIssues = [...issues].sort((a, b) => {
    // First by priority
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by status
    const statusOrder = { 'identified': 3, 'discussed': 2, 'solved': 1 };
    const statusDiff = statusOrder[b.status] - statusOrder[a.status];
    if (statusDiff !== 0) return statusDiff;

    // Finally by creation date (newest first)
    return new Date(b.createdDate) - new Date(a.createdDate);
  });

  return (
    <div className="table-container">
      <table className="eos-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Resolution</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map(issue => {
            const daysOld = getDaysOld(issue.createdDate);
            const resolutionTime = getResolutionTime(issue.createdDate, issue.resolvedDate);
            
            return (
              <tr key={issue.id} style={{ 
                opacity: issue.status === 'solved' ? 0.7 : 1,
                backgroundColor: issue.status === 'solved' ? '#f9f9f9' : 'white'
              }}>
                <td>
                  <div>
                    <strong>{issue.title}</strong>
                    {issue.description && (
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                        {issue.description.length > 100 
                          ? `${issue.description.substring(0, 100)}...` 
                          : issue.description
                        }
                      </div>
                    )}
                    {issue.relatedRock && (
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: '#1976d2', 
                        marginTop: '0.25rem',
                        fontStyle: 'italic'
                      }}>
                        🎯 Related to: {issue.relatedRock}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    color: getPriorityColor(issue.priority),
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {issue.priority}
                  </span>
                </td>
                <td>
                  <span className={`status ${issue.status}`}>
                    {getStatusLabel(issue.status)}
                  </span>
                </td>
                <td>{issue.owner || '—'}</td>
                <td>
                  <div>{formatDate(issue.createdDate)}</div>
                  {daysOld > 0 && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: daysOld > 30 ? '#f44336' : '#666' 
                    }}>
                      {daysOld} day{daysOld !== 1 ? 's' : ''} ago
                    </div>
                  )}
                </td>
                <td>
                  {issue.status === 'solved' ? (
                    <div>
                      <div>{formatDate(issue.resolvedDate)}</div>
                      {resolutionTime && (
                        <div style={{ fontSize: '0.8rem', color: '#4caf50' }}>
                          {resolutionTime}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#666' }}>—</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEditIssue(issue)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(issue.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      className={`btn btn-sm ${issue.status === 'solved' ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleStatusChange(issue, getNextStatus(issue.status))}
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      {getStatusButtonText(issue.status)}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesTable;