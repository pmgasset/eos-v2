import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import { validateForm } from '../../utils/validation';

const MetricForm = ({ initialData = {}, onClose }) => {
  const { createItem, updateItem } = useEOS();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    actual: '',
    owner: '',
    frequency: 'weekly'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    const validation = validateForm('metric', formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert goal and actual to numbers
      const metricData = {
        ...formData,
        goal: parseFloat(formData.goal) || 0,
        actual: parseFloat(formData.actual) || 0
      };

      if (initialData && initialData.id) {
        await updateItem('metric', initialData.id, metricData);
      } else {
        await createItem('metric', metricData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="name">Metric Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., New Customers, Revenue, Website Visitors"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="What does this metric measure? How is it calculated?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="goal">Goal *</label>
        <input
          type="number"
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className={errors.goal ? 'error' : ''}
          step="0.01"
          placeholder="Target number"
        />
        {errors.goal && <span className="error-text">{errors.goal}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="actual">Current Value</label>
        <input
          type="number"
          id="actual"
          name="actual"
          value={formData.actual}
          onChange={handleChange}
          step="0.01"
          placeholder="Current actual number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="owner">Owner *</label>
        <input
          type="text"
          id="owner"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          className={errors.owner ? 'error' : ''}
          placeholder="Who is responsible for this metric?"
        />
        {errors.owner && <span className="error-text">{errors.owner}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Reporting Frequency</label>
        <select
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
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
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Metric' : 'Add Metric')}
        </button>
      </div>
    </form>
  );
};

export default MetricForm;