import React from 'react';
import { useEOS } from '../../context/EOSContext';

const MeetingsTable = ({ meetings, onEditMeeting, onStartMeeting }) => {
  const { deleteItem, updateItem } = useEOS();

  const getMeetingStatus = (meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    
    if (meeting.status === 'completed') return 'completed';
    if (meetingDate < now) return 'overdue';
    if (meetingDate.toDateString() === now.toDateString()) return 'today';
    return 'upcoming';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'Completed',
      'overdue': 'Overdue',
      'today': 'Today',
      'upcoming': 'Upcoming'
    };
    return labels[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': '#4caf50',
      'overdue': '#f44336',
      'today': '#ff9800',
      'upcoming': '#2196f3'
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysFromNow = (dateString) => {
    const now = new Date();
    const meetingDate = new Date(dateString);
    const diffTime = meetingDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      await deleteItem('meeting', id);
    }
  };

  const handleMarkComplete = async (meeting) => {
    const updatedMeeting = {
      ...meeting,
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    await updateItem('meeting', meeting.id, updatedMeeting);
  };

  const renderRating = (rating) => {
    if (!rating) return '—';
    
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span key={i} style={{ 
          color: i <= rating ? '#ffd700' : '#ddd',
          fontSize: '0.8rem'
        }}>
          ★
        </span>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {stars}
        <span style={{ fontSize: '0.8rem', marginLeft: '0.25rem' }}>
          {rating}/10
        </span>
      </div>
    );
  };

  // Sort meetings: upcoming first, then by date
  const sortedMeetings = [...meetings].sort((a, b) => {
    const statusA = getMeetingStatus(a);
    const statusB = getMeetingStatus(b);
    
    // Priority order for statuses
    const statusOrder = {
      'today': 4,
      'upcoming': 3,
      'overdue': 2,
      'completed': 1
    };
    
    const statusDiff = statusOrder[statusB] - statusOrder[statusA];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by date (newest first for completed, earliest first for upcoming)
    if (statusA === 'completed' && statusB === 'completed') {
      return new Date(b.date) - new Date(a.date);
    }
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Meeting History</h3>
      <div className="table-container">
        <table className="eos-table">
          <thead>
            <tr>
              <th>Meeting</th>
              <th>Date & Time</th>
              <th>Facilitator</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMeetings.map(meeting => {
              const status = getMeetingStatus(meeting);
              const daysFromNow = getDaysFromNow(meeting.date);
              
              return (
                <tr key={meeting.id}>
                  <td>
                    <div>
                      <strong>{meeting.title}</strong>
                      {meeting.notes && (
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                          {meeting.notes.length > 100 
                            ? `${meeting.notes.substring(0, 100)}...` 
                            : meeting.notes
                          }
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>{formatDate(meeting.date)}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {formatTime(meeting.date)} • {daysFromNow}
                    </div>
                  </td>
                  <td>{meeting.facilitator || '—'}</td>
                  <td>
                    <span 
                      className="status"
                      style={{ 
                        backgroundColor: getStatusColor(status) + '20',
                        color: getStatusColor(status),
                        border: `1px solid ${getStatusColor(status)}40`
                      }}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </td>
                  <td>
                    {renderRating(meeting.rating)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {status !== 'completed' && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => onStartMeeting(meeting)}
                          >
                            {status === 'today' ? 'Start' : 'Preview'}
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => onEditMeeting(meeting)}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {status !== 'completed' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarkComplete(meeting)}
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                          >
                            Mark Complete
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(meeting.id)}
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingsTable;