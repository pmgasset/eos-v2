const API_BASE = 'https://eos-platform-api.traveldata.workers.dev/api/v1';

class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new APIError(result.error || 'API request failed', response.status, result);
    }
    
    return result;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

// Generic CRUD operations
export const getItems = (type) => apiCall(`/${getEndpoint(type)}`);
export const getItem = (type, id) => apiCall(`/${getEndpoint(type)}/${id}`);
export const createItem = (type, data) => apiCall(`/${getEndpoint(type)}`, 'POST', data);
export const updateItem = (type, id, data) => apiCall(`/${getEndpoint(type)}/${id}`, 'PUT', data);
export const deleteItem = (type, id) => apiCall(`/${getEndpoint(type)}/${id}`, 'DELETE');

// Specific API methods
export const getMetrics = () => getItems('metric');
export const getRocks = () => getItems('rock');
export const getIssues = () => getItems('issue');
export const getPeople = () => getItems('person');
export const getMeetings = () => getItems('meeting');
export const getTodos = () => getItems('todo');
export const getVision = () => apiCall('/vision');

// Helper function
const getEndpoint = (type) => {
  const endpoints = {
    'person': 'people',
    'metric': 'metrics',
    'rock': 'rocks',
    'issue': 'issues',
    'meeting': 'meetings',
    'todo': 'todos'
  };
  return endpoints[type] || `${type}s`;
};