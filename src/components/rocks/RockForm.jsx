import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import { validateForm } from '../../utils/validation';

const RockForm = ({ initialData = {}, onClose }) => {
  const { createItem, updateItem } = useEOS();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: '',
    dueDate: '',
    priority: 'medium',
    progress: 0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        ...initialData,
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        progress: initialData.progress || 0
      });
    } else {
      // Set default due date to 90 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 90);
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Special handling for progress to ensure it's between 0-100
    if (name === 'progress') {
      processedValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
    
    const validation = validateForm('rock', formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const rockData = {
        ...formData,
        progress: parseInt(formData.progress) || 0,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (initialData && initialData.id) {
        await updateItem('rock', initialData.id, rockData);
      } else {
        await createItem('rock', rockData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving rock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#4caf50';
    if (progress >= 70) return '#2196f3';
    if (progress >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="title">Rock Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="e.g., Launch new product line, Hire 5 sales reps"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="What needs to be accomplished? What does success look like?"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="owner">Owner *</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className={errors.owner ? 'error' : ''}
            placeholder="Who is responsible?"
          />
          {errors.owner && <span className="error-text">{errors.owner}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={errors.dueDate ? 'error' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
          <small style={{ fontSize: '0.8rem', color: '#666' }}>
            Typically 90 days from start of quarter
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="progress">Progress %</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="range"
              id="progress"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              style={{ flex: 1 }}
            />
            <input
              type="number"
              value={formData.progress}
              onChange={handleChange}
              name="progress"
              min="0"
              max="100"
              style={{ width: '60px' }}
            />
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '4px',
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${formData.progress}%`,
              height: '100%',
              backgroundColor: getProgressColor(formData.progress),
              transition: 'all 0.3s ease'
            }} />
          </div>
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
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Rock' : 'Add Rock')}
        </button>
      </div>
    </form>
  );
};

export default RockForm;