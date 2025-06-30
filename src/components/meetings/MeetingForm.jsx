import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import { validateForm } from '../../utils/validation';

const MeetingForm = ({ initialData = {}, onClose }) => {
  const { createItem, updateItem, people } = useEOS();
  const [formData, setFormData] = useState({
    title: 'Weekly L10 Meeting',
    date: '',
    time: '09:00',
    facilitator: '',
    attendees: [],
    agenda: 'standard',
    notes: '',
    location: 'Conference Room',
    duration: 90,
    recurring: false,
    recurringPattern: 'weekly'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      const meetingDate = new Date(initialData.date);
      setFormData({
        ...initialData,
        date: meetingDate.toISOString().split('T')[0],
        time: meetingDate.toTimeString().slice(0, 5),
        attendees: initialData.attendees || [],
        recurring: initialData.recurring || false,
        recurringPattern: initialData.recurringPattern || 'weekly'
      });
    } else {
      // Set default to next Monday at 9 AM
      const nextMonday = getNextMonday();
      setFormData(prev => ({
        ...prev,
        date: nextMonday.toISOString().split('T')[0]
      }));
    }
  }, [initialData]);

  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If Sunday, next day; otherwise, calculate
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAttendeeChange = (personId, isSelected) => {
    setFormData(prev => ({
      ...prev,
      attendees: isSelected 
        ? [...prev.attendees, personId]
        : prev.attendees.filter(id => id !== personId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.date || !formData.time) {
      setErrors({
        title: !formData.title ? 'Meeting title is required' : '',
        date: !formData.date ? 'Meeting date is required' : '',
        time: !formData.time ? 'Meeting time is required' : ''
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const meetingDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const meetingData = {
        ...formData,
        date: meetingDateTime.toISOString(),
        status: 'scheduled'
      };

      if (initialData && initialData.id) {
        await updateItem('meeting', initialData.id, meetingData);
      } else {
        await createItem('meeting', meetingData);
        
        // If recurring, create future meetings
        if (formData.recurring) {
          await createRecurringMeetings(meetingData);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createRecurringMeetings = async (baseMeeting) => {
    const meetings = [];
    const baseDate = new Date(baseMeeting.date);
    
    // Create next 12 recurring meetings
    for (let i = 1; i <= 12; i++) {
      const nextDate = new Date(baseDate);
      
      if (formData.recurringPattern === 'weekly') {
        nextDate.setDate(baseDate.getDate() + (i * 7));
      } else if (formData.recurringPattern === 'biweekly') {
        nextDate.setDate(baseDate.getDate() + (i * 14));
      } else if (formData.recurringPattern === 'monthly') {
        nextDate.setMonth(baseDate.getMonth() + i);
      }
      
      const recurringMeeting = {
        ...baseMeeting,
        date: nextDate.toISOString(),
        title: `${baseMeeting.title} (${i + 1})`
      };
      
      meetings.push(recurringMeeting);
    }
    
    // Create all recurring meetings
    for (const meeting of meetings) {
      try {
        await createItem('meeting', meeting);
      } catch (error) {
        console.error('Error creating recurring meeting:', error);
      }
    }
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="title">Meeting Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="e.g., Weekly L10 Meeting"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="time">Time *</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? 'error' : ''}
          />
          {errors.time && <span className="error-text">{errors.time}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          >
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes (recommended)</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="facilitator">Facilitator</label>
          <select
            id="facilitator"
            name="facilitator"
            value={formData.facilitator}
            onChange={handleChange}
          >
            <option value="">Select facilitator</option>
            {people.map(person => (
              <option key={person.id} value={person.name}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Conference Room, Zoom, etc."
          />
        </div>
      </div>

      {/* Attendees Selection */}
      {people.length > 0 && (
        <div className="form-group">
          <label>Attendees</label>
          <div style={{ 
            maxHeight: '120px', 
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '0.5rem'
          }}>
            {people.map(person => (
              <label 
                key={person.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.25rem 0',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.attendees.includes(person.id)}
                  onChange={(e) => handleAttendeeChange(person.id, e.target.checked)}
                />
                <span>{person.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  ({person.role})
                </span>
              </label>
            ))}
          </div>
          <small style={{ fontSize: '0.8rem', color: '#666' }}>
            Select team members who should attend this meeting
          </small>
        </div>
      )}

      {/* Recurring Options */}
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="recurring"
            checked={formData.recurring}
            onChange={handleChange}
          />
          <span>Create recurring meetings</span>
        </label>
        
        {formData.recurring && (
          <div style={{ marginTop: '0.5rem' }}>
            <select
              name="recurringPattern"
              value={formData.recurringPattern}
              onChange={handleChange}
              style={{ width: '200px' }}
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <small style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              Will create the next 12 meetings in the series
            </small>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Meeting Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any special notes or agenda items for this meeting..."
        />
      </div>

      {/* L10 Agenda Preview */}
      <div style={{ 
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>L10 Meeting Agenda ({formData.duration} minutes)</h4>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <div>📋 Segue (5 min) - Personal & business check-in</div>
          <div>📊 Scorecard (5 min) - Review weekly numbers</div>
          <div>🎯 Rock Review (5 min) - 90-day priority updates</div>
          <div>👥 Customer/Employee Headlines (5 min)</div>
          <div>✅ To-Do List (5 min) - Previous action items</div>
          <div>🔥 IDS (Issues, Discuss, Solve) ({formData.duration - 25} min) - Problem solving</div>
          <div>📝 Conclude (5 min) - Recap and rate meeting</div>
        </div>
      </div>

      <div className="modal-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Scheduling...' : (initialData && initialData.id ? 'Update Meeting' : 'Schedule Meeting')}
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;