import React from 'react';
import { useEOS } from '../../context/EOSContext';

const RocksTable = ({ rocks, onEditRock }) => {
  const { deleteItem, updateItem } = useEOS();

  const getRockStatus = (progress, dueDate) => {
    if (progress >= 100) return 'completed';
    
    const now = new Date();
    const due = new Date(dueDate);
    const daysRemaining = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    // Calculate expected progress based on 90-day timeline
    const quarterStart = new Date(due.getTime() - (90 * 24 * 60 * 60 * 1000));
    const totalDays = 90;
    const daysPassed = Math.max(0, Math.ceil((now - quarterStart) / (1000 * 60 * 60 * 24)));
    const expectedProgress = Math.min(100, (daysPassed / totalDays) * 100);
    
    if (daysRemaining < 0) return 'overdue';
    if (progress >= expectedProgress - 10) return 'on-track';
    return 'behind';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'Completed',
      'on-track': 'On Track',
      'behind': 'Behind',
      'overdue': 'Overdue'
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
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysRemaining = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return '1 day remaining';
    return `${daysRemaining} days remaining`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rock?')) {
      await deleteItem('rock', id);
    }
  };

  const handleProgressUpdate = async (rock, newProgress) => {
    await updateItem('rock', rock.id, { ...rock, progress: newProgress });
  };

  return (
    <div className="table-container">
      <table className="eos-table">
        <thead>
          <tr>
            <th>Rock</th>
            <th>Owner</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rocks.map(rock => {
            const status = getRockStatus(rock.progress || 0, rock.dueDate);
            const daysRemaining = getDaysRemaining(rock.dueDate);
            
            return (
              <tr key={rock.id}>
                <td>
                  <strong>{rock.title}</strong>
                  {rock.description && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      {rock.description}
                    </div>
                  )}
                </td>
                <td>{rock.owner}</td>
                <td>
                  <div>{formatDate(rock.dueDate)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {daysRemaining}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    color: getPriorityColor(rock.priority),
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {rock.priority}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '8px', 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${rock.progress || 0}%`,
                        height: '100%',
                        backgroundColor: status === 'completed' ? '#4caf50' : 
                                       status === 'on-track' ? '#2196f3' : '#f44336',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {rock.progress || 0}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`status ${status}`}>
                    {getStatusLabel(status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEditRock(rock)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(rock.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {status !== 'completed' && (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => handleProgressUpdate(rock, Math.min(100, (rock.progress || 0) + 10))}
                        >
                          +10%
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => handleProgressUpdate(rock, Math.min(100, (rock.progress || 0) + 25))}
                        >
                          +25%
                        </button>
                      </div>
                    )}
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

export default RocksTable;