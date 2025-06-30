import { API_BASE } from '../utils/constants';

// Base API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Metrics API
export const getMetrics = () => apiCall('/metrics');
export const createMetric = (data) => apiCall('/metrics', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updateMetric = (id, data) => apiCall(`/metrics/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteMetric = (id) => apiCall(`/metrics/${id}`, {
  method: 'DELETE'
});

// Rocks API
export const getRocks = () => apiCall('/rocks');
export const createRock = (data) => apiCall('/rocks', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updateRock = (id, data) => apiCall(`/rocks/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteRock = (id) => apiCall(`/rocks/${id}`, {
  method: 'DELETE'
});

// Issues API
export const getIssues = () => apiCall('/issues');
export const createIssue = (data) => apiCall('/issues', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updateIssue = (id, data) => apiCall(`/issues/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteIssue = (id) => apiCall(`/issues/${id}`, {
  method: 'DELETE'
});

// People API
export const getPeople = () => apiCall('/people');
export const createPerson = (data) => apiCall('/people', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updatePerson = (id, data) => apiCall(`/people/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deletePerson = (id) => apiCall(`/people/${id}`, {
  method: 'DELETE'
});

// Meetings API
export const getMeetings = () => apiCall('/meetings');
export const createMeeting = (data) => apiCall('/meetings', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updateMeeting = (id, data) => apiCall(`/meetings/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteMeeting = (id) => apiCall(`/meetings/${id}`, {
  method: 'DELETE'
});

// Todos API
export const getTodos = () => apiCall('/todos');
export const createTodo = (data) => apiCall('/todos', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const updateTodo = (id, data) => apiCall(`/todos/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteTodo = (id) => apiCall(`/todos/${id}`, {
  method: 'DELETE'
});

// Vision API
export const getVision = () => apiCall('/vision');
export const updateVision = (data) => apiCall('/vision', {
  method: 'PUT',
  body: JSON.stringify(data)
});

// Generic CRUD operations
export const createItem = async (type, data) => {
  const apiMap = {
    metric: createMetric,
    rock: createRock,
    issue: createIssue,
    person: createPerson,
    meeting: createMeeting,
    todo: createTodo
  };
  
  const apiFunction = apiMap[type];
  if (!apiFunction) {
    throw new Error(`Unknown item type: ${type}`);
  }
  
  return await apiFunction(data);
};

export const updateItem = async (type, id, data) => {
  const apiMap = {
    metric: updateMetric,
    rock: updateRock,
    issue: updateIssue,
    person: updatePerson,
    meeting: updateMeeting,
    todo: updateTodo
  };
  
  const apiFunction = apiMap[type];
  if (!apiFunction) {
    throw new Error(`Unknown item type: ${type}`);
  }
  
  return await apiFunction(id, data);
};

export const deleteItem = async (type, id) => {
  const apiMap = {
    metric: deleteMetric,
    rock: deleteRock,
    issue: deleteIssue,
    person: deletePerson,
    meeting: deleteMeeting,
    todo: deleteTodo
  };
  
  const apiFunction = apiMap[type];
  if (!apiFunction) {
    throw new Error(`Unknown item type: ${type}`);
  }
  
  return await apiFunction(id);
};