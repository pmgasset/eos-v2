import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';

const ActiveMeeting = ({ meeting, onClose }) => {
  const { metrics, rocks, issues, todos, updateItem, createItem } = useEOS();
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingRating, setMeetingRating] = useState(0);
  const [actionItems, setActionItems] = useState([]);
  const [newActionItem, setNewActionItem] = useState({ task: '', owner: '', dueDate: '' });

  const agendaItems = [
    { name: 'Segue', duration: 5, description: 'Personal check-in and business headlines' },
    { name: 'Scorecard', duration: 5, description: 'Review weekly numbers and metrics' },
    { name: 'Rock Review', duration: 5, description: '90-day priority updates' },
    { name: 'Headlines', duration: 5, description: 'Customer and employee headlines' },
    { name: 'To-Dos', duration: 5, description: 'Review previous action items' },
    { name: 'IDS', duration: meeting.duration - 25, description: 'Issues, Discuss, Solve' },
    { name: 'Conclude', duration: 5, description: 'Recap and rate meeting' }
  ];

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, []);

  const currentAgenda = agendaItems[currentAgendaIndex];
  const totalDuration = agendaItems.reduce((sum, item) => sum + item.duration, 0);
  const elapsedTime = startTime ? Math.floor((new Date() - startTime) / 60000) : 0;

  const handleNext = () => {
    if (currentAgendaIndex < agendaItems.length - 1) {
      setCurrentAgendaIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentAgendaIndex > 0) {
      setCurrentAgendaIndex(prev => prev - 1);
    }
  };

  const handleAddActionItem = () => {
    if (newActionItem.task && newActionItem.owner) {
      setActionItems(prev => [...prev, { 
        ...newActionItem, 
        id: Date.now().toString(),
        completed: false,
        meetingId: meeting.id
      }]);
      setNewActionItem({ task: '', owner: '', dueDate: '' });
    }
  };

  const handleCompleteMeeting = async () => {
    try {
      // Save meeting with notes and rating
      const updatedMeeting = {
        ...meeting,
        status: 'completed',
        completedAt: new Date().toISOString(),
        notes: meetingNotes,
        rating: meetingRating,
        duration: elapsedTime
      };
      
      await updateItem('meeting', meeting.id, updatedMeeting);
      
      // Create action items as todos
      for (const item of actionItems) {
        await createItem('todo', item);
      }
      
      onClose();
    } catch (error) {
      console.error('Error completing meeting:', error);
    }
  };

  const renderAgendaContent = () => {
    switch (currentAgenda.name) {
      case 'Segue':
        return (
          <div>
            <h4>Personal & Business Check-in</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Go around the room and share personal and business headlines. Keep it brief and positive.
            </div>
            <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
              <li>Personal good news (30 seconds each)</li>
              <li>Business good news and updates</li>
              <li>Set the tone for a productive meeting</li>
            </ul>
          </div>
        );
        
      case 'Scorecard':
        return (
          <div>
            <h4>Scorecard Review</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Review this week's numbers. Focus on trends and exceptions.
            </div>
            {metrics.length > 0 ? (
              <div className="table-container">
                <table className="eos-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Goal</th>
                      <th>Actual</th>
                      <th>Status</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map(metric => (
                      <tr key={metric.id}>
                        <td>{metric.name}</td>
                        <td>{metric.goal}</td>
                        <td>{metric.actual || '—'}</td>
                        <td>
                          <span className={`status ${metric.status || 'unknown'}`}>
                            {metric.status || 'Unknown'}
                          </span>
                        </td>
                        <td>{metric.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontStyle: 'italic', color: '#666' }}>
                No metrics to review. Add metrics in the Scorecard section.
              </div>
            )}
          </div>
        );
        
      case 'Rock Review':
        return (
          <div>
            <h4>90-Day Rock Updates</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Quick updates on rock progress. Keep it brief - on track or off track.
            </div>
            {rocks.length > 0 ? (
              <div className="table-container">
                <table className="eos-table">
                  <thead>
                    <tr>
                      <th>Rock</th>
                      <th>Owner</th>
                      <th>Due Date</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rocks.map(rock => (
                      <tr key={rock.id}>
                        <td>{rock.title}</td>
                        <td>{rock.owner}</td>
                        <td>{new Date(rock.dueDate).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ 
                              width: '50px', 
                              height: '8px', 
                              backgroundColor: '#e0e0e0', 
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${rock.progress}%`,
                                height: '100%',
                                backgroundColor: rock.progress >= 70 ? '#4caf50' : '#f44336'
                              }} />
                            </div>
                            <span>{rock.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status ${rock.progress >= 70 ? 'on-track' : 'behind'}`}>
                            {rock.progress >= 100 ? 'Complete' : rock.progress >= 70 ? 'On Track' : 'Behind'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontStyle: 'italic', color: '#666' }}>
                No rocks to review. Add rocks in the Rocks section.
              </div>
            )}
          </div>
        );
        
      case 'Headlines':
        return (
          <div>
            <h4>Customer & Employee Headlines</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Share important customer feedback, employee updates, or other key headlines.
            </div>
            <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
              <li>Customer wins, feedback, or concerns</li>
              <li>Employee updates, achievements, or issues</li>
              <li>Market or competitive intelligence</li>
              <li>Keep it brief and actionable</li>
            </ul>
          </div>
        );
        
      case 'To-Dos':
        return (
          <div>
            <h4>To-Do Review</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Review action items from previous meetings. Mark complete or carry forward.
            </div>
            {todos.filter(t => t.meetingId).length > 0 ? (
              <div className="table-container">
                <table className="eos-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Owner</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.filter(t => t.meetingId).map(todo => (
                      <tr key={todo.id}>
                        <td>{todo.task}</td>
                        <td>{todo.owner}</td>
                        <td>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '—'}</td>
                        <td>
                          <span className={`status ${todo.completed ? 'completed' : 'pending'}`}>
                            {todo.completed ? 'Complete' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontStyle: 'italic', color: '#666' }}>
                No previous action items to review.
              </div>
            )}
          </div>
        );
        
      case 'IDS':
        return (
          <div>
            <h4>Issues, Discuss, Solve</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Identify issues, discuss root causes, and solve with specific action steps.
            </div>
            {issues.filter(i => i.status !== 'solved').length > 0 ? (
              <div className="table-container">
                <table className="eos-table">
                  <thead>
                    <tr>
                      <th>Issue</th>
                      <th>Priority</th>
                      <th>Owner</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.filter(i => i.status !== 'solved').map(issue => (
                      <tr key={issue.id}>
                        <td>{issue.title}</td>
                        <td>
                          <span style={{ 
                            color: issue.priority === 'high' ? '#f44336' : 
                                   issue.priority === 'medium' ? '#ff9800' : '#4caf50',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}>
                            {issue.priority}
                          </span>
                        </td>
                        <td>{issue.owner || '—'}</td>
                        <td>
                          <span className={`status ${issue.status}`}>
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ fontStyle: 'italic', color: '#666' }}>
                No open issues to discuss.
              </div>
            )}
          </div>
        );
        
      case 'Conclude':
        return (
          <div>
            <h4>Meeting Conclusion</h4>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Recap action items and rate the meeting effectiveness.
            </div>
            
            {/* Action Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h5>New Action Items</h5>
              {actionItems.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {actionItems.map(item => (
                    <div key={item.id} style={{ 
                      padding: '0.5rem', 
                      backgroundColor: '#f0f8ff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>{item.task}</strong> - {item.owner}
                      {item.dueDate && ` (Due: ${new Date(item.dueDate).toLocaleDateString()})`}
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <input
                  type="text"
                  placeholder="Action item description"
                  value={newActionItem.task}
                  onChange={(e) => setNewActionItem(prev => ({ ...prev, task: e.target.value }))}
                  style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Owner"
                  value={newActionItem.owner}
                  onChange={(e) => setNewActionItem(prev => ({ ...prev, owner: e.target.value }))}
                  style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="date"
                  value={newActionItem.dueDate}
                  onChange={(e) => setNewActionItem(prev => ({ ...prev, dueDate: e.target.value }))}
                  style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button 
                  onClick={handleAddActionItem}
                  className="btn btn-sm btn-primary"
                  disabled={!newActionItem.task || !newActionItem.owner}
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Meeting Rating */}
            <div>
              <h5>Rate This Meeting (1-10)</h5>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMeetingRating(rating)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: meetingRating === rating ? '2px solid #1976d2' : '1px solid #ddd',
                      backgroundColor: meetingRating === rating ? '#e3f2fd' : 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: meetingRating === rating ? 'bold' : 'normal'
                    }}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Agenda item content</div>;
    }
  };

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Meeting Header */}
      <div style={{ 
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>{meeting.title}</h3>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {new Date(meeting.date).toLocaleDateString()} • Facilitator: {meeting.facilitator || 'TBD'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {elapsedTime} / {totalDuration} min
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Current: {currentAgenda.name} ({currentAgenda.duration} min)
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        height: '4px', 
        backgroundColor: '#e0e0e0',
        position: 'relative'
      }}>
        <div style={{
          height: '100%',
          width: `${(currentAgendaIndex / (agendaItems.length - 1)) * 100}%`,
          backgroundColor: '#4caf50',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Agenda Navigation */}
      <div style={{ 
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {agendaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentAgendaIndex(index)}
              style={{
                padding: '0.5rem 1rem',
                border: index === currentAgendaIndex ? '2px solid #1976d2' : '1px solid #ddd',
                backgroundColor: index === currentAgendaIndex ? '#e3f2fd' : 
                                index < currentAgendaIndex ? '#e8f5e8' : 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
            {currentAgenda.name} ({currentAgenda.duration} minutes)
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            {currentAgenda.description}
          </p>
        </div>
        
        {renderAgendaContent()}
      </div>

      {/* Meeting Notes */}
      <div style={{ 
        padding: '1rem',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Meeting Notes
        </label>
        <textarea
          value={meetingNotes}
          onChange={(e) => setMeetingNotes(e.target.value)}
          placeholder="Add notes, key decisions, or important discussions..."
          style={{
            width: '100%',
            height: '80px',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Navigation Buttons */}
      <div style={{ 
        padding: '1rem',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={handlePrevious}
          disabled={currentAgendaIndex === 0}
          className="btn btn-secondary"
        >
          ← Previous
        </button>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentAgendaIndex === agendaItems.length - 1 ? (
            <button 
              onClick={handleCompleteMeeting}
              className="btn btn-success"
              disabled={!meetingRating}
            >
              Complete Meeting
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next →
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Exit Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveMeeting;