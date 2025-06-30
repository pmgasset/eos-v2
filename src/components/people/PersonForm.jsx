import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import { validateForm } from '../../utils/validation';
import { SEAT_OPTIONS } from '../../utils/constants';

const PersonForm = ({ initialData = {}, onClose }) => {
  const { createItem, updateItem } = useEOS();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    seat: '',
    department: '',
    getIt: false,
    wantIt: false,
    capacity: false,
    email: '',
    phone: '',
    startDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        getIt: Boolean(initialData.getIt),
        wantIt: Boolean(initialData.wantIt),
        capacity: Boolean(initialData.capacity)
      });
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm('person', formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const personData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null
      };

      if (initialData && initialData.id) {
        await updateItem('person', initialData.id, personData);
      } else {
        await createItem('person', personData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGWCStatus = () => {
    const { getIt, wantIt, capacity } = formData;
    if (getIt && wantIt && capacity) return { status: 'Right Person, Right Seat', color: '#4caf50' };
    if (getIt && wantIt && !capacity) return { status: 'Right Person, Wrong Seat', color: '#ff9800' };
    if (getIt && wantIt) return { status: 'Right Person', color: '#2196f3' };
    return { status: 'Needs Development', color: '#f44336' };
  };

  const gwcStatus = getGWCStatus();

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., John Smith"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? 'error' : ''}
            placeholder="e.g., Sales Manager, Developer"
          />
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="seat">Seat *</label>
          <select
            id="seat"
            name="seat"
            value={formData.seat}
            onChange={handleChange}
            className={errors.seat ? 'error' : ''}
          >
            <option value="">Select a seat</option>
            {SEAT_OPTIONS.map(seat => (
              <option key={seat} value={seat}>{seat}</option>
            ))}
          </select>
          {errors.seat && <span className="error-text">{errors.seat}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Sales, Engineering, Marketing"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* GWC Assessment Section */}
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>GWC Assessment</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="getIt"
                checked={formData.getIt}
                onChange={handleChange}
              />
              <div>
                <strong>Get It</strong>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Understands role & responsibilities
                </div>
              </div>
            </label>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="wantIt"
                checked={formData.wantIt}
                onChange={handleChange}
              />
              <div>
                <strong>Want It</strong>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Has desire & motivation
                </div>
              </div>
            </label>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="capacity"
                checked={formData.capacity}
                onChange={handleChange}
              />
              <div>
                <strong>Capacity</strong>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Has time & capability
                </div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          backgroundColor: gwcStatus.color + '20',
          border: `1px solid ${gwcStatus.color}40`,
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <strong style={{ color: gwcStatus.color }}>
            Assessment: {gwcStatus.status}
          </strong>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Additional notes about this team member, performance, goals, etc."
        />
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
          {isSubmitting ? 'Saving...' : (initialData && initialData.id ? 'Update Team Member' : 'Add Team Member')}
        </button>
      </div>
    </form>
  );
};

export default PersonForm;