import React, { useState, useEffect } from 'react';
import { useEOS } from '../../context/EOSContext';
import { validateForm } from '../../utils/validation';

const IssueForm = ({ initialData = {}, onClose }) => {
  const { createItem, updateItem, rocks } = useEOS();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'identified',
    owner: '',
    relatedRock: '',
    category: 'general'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        ...initialData,
        relatedRock: initialData.relatedRock || '',
        category: initialData.category || 'general'
      });
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
    
    const validation = validateForm('issue', formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const issueData = {
        ...formData,
        createdDate: initialData.createdDate || new Date().toISOString(),
        resolvedDate: formData.status === 'solved' && !initialData.resolvedDate 
          ? new Date().toISOString() 
          : initialData.resolvedDate || null
      };

      if (initialData && initialData.id) {
        await updateItem('issue', initialData.id, issueData);
      } else {
        await createItem('issue', issueData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const issueCategories = [
    { value: 'general', label: 'General' },
    { value: 'people', label: 'People' },
    { value: 'process', label: 'Process' },
    { value: 'data', label: 'Data/Systems' },
    { value: 'customer', label: 'Customer' },
    { value: 'financial', label: 'Financial' },
    { value: 'strategic', label: 'Strategic' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'identified': '#ff9800',
      'discussed': '#2196f3',
      'solved': '#4caf50'
    };
    return colors[status] || '#666';
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="title">Issue Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="e.g., Sales team missing weekly targets, Customer complaints increasing"
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
          rows={4}
          placeholder="Provide more details about the issue. What's happening? What's the impact? What have you tried?"
        />
        <small style={{ fontSize: '0.8rem', color: '#666' }}>
          Tip: Be specific about symptoms, impact, and any patterns you've noticed
        </small>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={errors.priority ? 'error' : ''}
          >
            <option value="high">High - Urgent attention needed</option>
            <option value="medium">Medium - Important but not urgent</option>
            <option value="low">Low - Monitor and address when possible</option>
          </select>
          {errors.priority && <span className="error-text">{errors.priority}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {issueCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="owner">Owner</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Who will take point on this issue?"
          />
          <small style={{ fontSize: '0.8rem', color: '#666' }}>
            The person responsible for driving the issue to resolution
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ 
              borderLeft: `4px solid ${getStatusColor(formData.status)}`,
              paddingLeft: '0.75rem'
            }}
          >
            <option value="identified">Identified - Issue recognized</option>
            <option value="discussed">Discussed - Root cause analyzed</option>
            <option value="solved">Solved - Resolution implemented</option>
          </select>
        </div>
      </div>

      {rocks.length > 0 && (
        <div className="form-group">
          <label htmlFor="relatedRock">Related Rock (Optional)</label>
          <select
            id="relatedRock"
            name="relatedRock"
            value={formData.relatedRock}
            onChange={handleChange}
          >
            <option value="">No related rock</option>
            {rocks.map(rock => (
              <option key={rock.id} value={rock.title}>
                {rock.title}
              </option>
            ))}
          </select>
          <small style={{ fontSize: '0.8rem', color: '#666' }}>
            Link this issue to a specific 90-day priority if relevant
          </small>
        </div>
      )}

      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px', 
        marginTop: '1rem',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>IDS Process Reminder:</h4>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <strong>Identify:</strong> Clearly state the real issue (not symptoms)<br/>
          <strong>Discuss:</strong> Get to the root cause and explore solutions<br/>
          <strong>Solve:</strong> Agree on specific action steps with clear ownership
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
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Issue' : 'Add Issue')}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;