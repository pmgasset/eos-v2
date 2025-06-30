export const validateForm = (type, data) => {
  const errors = {};
  
  const validators = {
    metric: {
      name: (value) => !value && 'Metric name is required',
      goal: (value) => !value && 'Goal is required',
      owner: (value) => !value && 'Owner is required'
    },
    rock: {
      title: (value) => !value && 'Rock title is required',
      owner: (value) => !value && 'Owner is required',
      dueDate: (value) => {
        if (!value) return 'Due date is required';
        const dueDate = new Date(value);
        const now = new Date();
        if (dueDate <= now) return 'Due date must be in the future';
        return null;
      }
    },
    issue: {
      title: (value) => !value && 'Issue title is required',
      priority: (value) => !value && 'Priority is required'
    },
    person: {
      name: (value) => !value && 'Name is required',
      role: (value) => !value && 'Role is required',
      seat: (value) => !value && 'Seat is required'
    }
  };

  const typeValidators = validators[type] || {};
  
  Object.keys(typeValidators).forEach(field => {
    const error = typeValidators[field](data[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};