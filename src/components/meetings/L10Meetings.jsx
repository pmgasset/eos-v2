import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';
import MeetingsTable from './MeetingsTable';
import MeetingForm from './MeetingForm';
import ActiveMeeting from './ActiveMeeting';
import Modal from '../common/Modal';

const L10Meetings = () => {
  const { meetings, todos } = useEOS();
  const { showModal, modalType, modalData, openModal, closeModal } = useModal();

  const handleScheduleMeeting = () => {
    openModal('meeting');
  };

  const handleEditMeeting = (meeting) => {
    openModal('meeting', meeting);
  };

  const handleStartMeeting = (meeting) => {
    openModal('activeMeeting', meeting);
  };

  const getMeetingStats = () => {
    const total = meetings.length;
    const completed = meetings.filter(m => m.status === 'completed').length;
    const upcoming = meetings.filter(m => {
      const meetingDate = new Date(m.date);
      const now = new Date();
      return meetingDate > now && m.status !== 'completed';
    }).length;
    const overdue = meetings.filter(m => {
      const meetingDate = new Date(m.date);
      const now = new Date();
      return meetingDate < now && m.status !== 'completed';
    }).length;

    const avgRating = completed > 0 ? 
      Math.round(meetings
        .filter(m => m.rating && m.status === 'completed')
        .reduce((sum, m) => sum + m.rating, 0) / 
        meetings.filter(m => m.rating && m.status === 'completed').length * 10) / 10 : 0;

    const pendingTodos = todos.filter(t => !t.completed && t.meetingId).length;

    return { total, completed, upcoming, overdue, avgRating, pendingTodos };
  };

  const getNextMeeting = () => {
    const now = new Date();
    return meetings
      .filter(m => new Date(m.date) > now && m.status !== 'completed')
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  };

  const stats = getMeetingStats();
  const nextMeeting = getNextMeeting();

  return (
    <div className="l10-meetings">
      <div className="section-header">
        <h2>L10 Meetings - Weekly Leadership Team Meetings</h2>
        <button className="btn btn-primary" onClick={handleScheduleMeeting}>
          + Schedule Meeting
        </button>
      </div>

      {/* Next Meeting Alert */}
      {nextMeeting && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
                📅 Next L10 Meeting
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {nextMeeting.title} - {new Date(nextMeeting.date).toLocaleDateString()} at {new Date(nextMeeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                Facilitator: {nextMeeting.facilitator || 'TBD'}
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => handleStartMeeting(nextMeeting)}
            >
              Start Meeting
            </button>
          </div>
        </div>
      )}

      {/* Meeting Stats */}
      {meetings.length > 0 && (
        <div className="meetings-stats">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <h3>Total Meetings</h3>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">{stats.completed} Completed</div>
            </div>
            <div className="stat-card">
              <h3>Upcoming</h3>
              <div className="stat-number" style={{ color: '#2196f3' }}>
                {stats.upcoming}
              </div>
              <div className="stat-label">Scheduled Meetings</div>
            </div>
            <div className="stat-card">
              <h3>Meeting Rating</h3>
              <div className="stat-number" style={{ color: stats.avgRating >= 8 ? '#4caf50' : stats.avgRating >= 6 ? '#ff9800' : '#f44336' }}>
                {stats.avgRating || '—'}
              </div>
              <div className="stat-label">Average Score (1-10)</div>
            </div>
            <div className="stat-card">
              <h3>Action Items</h3>
              <div className="stat-number">{stats.pendingTodos}</div>
              <div className="stat-label">Pending To-Dos</div>
            </div>
          </div>
        </div>
      )}

      {/* L10 Meeting Template Info */}
      {meetings.length === 0 && (
        <div className="empty-section">
          <h3>No L10 meetings scheduled</h3>
          <p>Level 10 meetings are the heartbeat of EOS. Schedule your weekly leadership team meetings to maintain focus and accountability.</p>
          
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>The L10 Meeting Agenda (90 minutes):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <strong>First 10 minutes:</strong>
                <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.9rem' }}>
                  <li>Personal Check-in</li>
                  <li>Business Headlines</li>
                  <li>Customer/Employee Headlines</li>
                </ul>
              </div>
              <div style={{ textAlign: 'left' }}>
                <strong>Next 80 minutes:</strong>
                <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.9rem' }}>
                  <li>Scorecard Review (5 min)</li>
                  <li>Rock Review (5 min)</li>
                  <li>Customer & Employee Headlines (5 min)</li>
                  <li>To-Do List (5 min)</li>
                  <li>IDS (Issues, Discuss, Solve) (60 min)</li>
                </ul>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleScheduleMeeting}>
            Schedule First L10 Meeting
          </button>
        </div>
      )}

      {meetings.length > 0 && (
        <MeetingsTable 
          meetings={meetings}
          onEditMeeting={handleEditMeeting}
          onStartMeeting={handleStartMeeting}
        />
      )}

      {/* Meeting Form Modal */}
      <Modal
        show={showModal && modalType === 'meeting'}
        onClose={closeModal}
        title={modalData ? 'Edit Meeting' : 'Schedule L10 Meeting'}
        size="lg"
      >
        <MeetingForm
          initialData={modalData}
          onClose={closeModal}
        />
      </Modal>

      {/* Active Meeting Modal */}
      <Modal
        show={showModal && modalType === 'activeMeeting'}
        onClose={closeModal}
        title="L10 Meeting in Progress"
        size="xl"
      >
        <ActiveMeeting
          meeting={modalData}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default L10Meetings;