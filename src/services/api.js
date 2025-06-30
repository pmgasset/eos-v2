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

// Field mapping functions to convert between frontend and backend formats
const mapMetricToBackend = (metric) => ({
  name: metric.name,
  goal: metric.goal,
  current: metric.actual, // Backend expects 'current', not 'current_value'
  status: metric.actual && metric.goal ? 
    (metric.actual >= metric.goal ? 'on-track' : 'behind') : 'unknown',
  owner: metric.owner
});

const mapMetricFromBackend = (metric) => ({
  id: metric.id,
  name: metric.name,
  goal: metric.goal,
  actual: metric.current_value, // Database stores as current_value
  status: metric.status,
  owner: metric.owner,
  description: metric.description || '',
  frequency: metric.frequency || 'weekly'
});

const mapRockToBackend = (rock) => ({
  title: rock.title,
  description: rock.description || '',
  owner: rock.owner,
  dueDate: rock.dueDate, // Backend expects dueDate, not due_date
  progress: rock.progress || 0
});

const mapRockFromBackend = (rock) => ({
  id: rock.id,
  title: rock.title,
  description: rock.description,
  owner: rock.owner,
  dueDate: rock.due_date, // Database stores as due_date, frontend expects dueDate
  priority: rock.priority || 'medium',
  progress: rock.progress
});

const mapIssueToBackend = (issue) => ({
  title: issue.title,
  description: issue.description || '',
  priority: issue.priority,
  assignee: issue.owner || '', // Backend expects 'assignee', frontend uses 'owner'
  status: issue.status || 'identified'
});

const mapIssueFromBackend = (issue) => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  priority: issue.priority,
  owner: issue.assignee,
  status: issue.status,
  relatedRock: issue.related_rock || '',
  category: issue.category || 'general',
  createdDate: issue.created_at,
  resolvedDate: issue.resolved_at
});

const mapPersonToBackend = (person) => ({
  name: person.name,
  role: person.role,
  seat: person.seat,
  department: person.department || '',
  getIt: person.getIt || false, // Backend expects camelCase
  wantIt: person.wantIt || false, // Backend expects camelCase  
  capacity: person.capacity || false
});

const mapPersonFromBackend = (person) => ({
  id: person.id,
  name: person.name,
  role: person.role,
  seat: person.seat,
  department: person.department,
  getIt: person.get_it,
  wantIt: person.want_it,
  capacity: person.capacity
});

// Metrics API
export const getMetrics = async () => {
  const response = await apiCall('/metrics');
  return {
    ...response,
    data: response.data.map(mapMetricFromBackend)
  };
};

export const createMetric = async (data) => {
  const mappedData = mapMetricToBackend(data);
  const response = await apiCall('/metrics', {
    method: 'POST',
    body: JSON.stringify(mappedData)
  });
  
  // Return the created metric with the ID
  return {
    ...response,
    data: { ...data, id: response.id }
  };
};

export const updateMetric = async (id, data) => {
  const mappedData = mapMetricToBackend(data);
  return await apiCall(`/metrics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mappedData)
  });
};

export const deleteMetric = (id) => apiCall(`/metrics/${id}`, {
  method: 'DELETE'
});

// Rocks API
export const getRocks = async () => {
  const response = await apiCall('/rocks');
  return {
    ...response,
    data: response.data.map(mapRockFromBackend)
  };
};

export const createRock = async (data) => {
  const mappedData = mapRockToBackend(data);
  const response = await apiCall('/rocks', {
    method: 'POST',
    body: JSON.stringify(mappedData)
  });
  
  return {
    ...response,
    data: { ...data, id: response.id }
  };
};

export const updateRock = async (id, data) => {
  const mappedData = mapRockToBackend(data);
  return await apiCall(`/rocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mappedData)
  });
};

export const deleteRock = (id) => apiCall(`/rocks/${id}`, {
  method: 'DELETE'
});

// Issues API
export const getIssues = async () => {
  const response = await apiCall('/issues');
  return {
    ...response,
    data: response.data.map(mapIssueFromBackend)
  };
};

export const createIssue = async (data) => {
  const mappedData = mapIssueToBackend(data);
  const response = await apiCall('/issues', {
    method: 'POST',
    body: JSON.stringify(mappedData)
  });
  
  return {
    ...response,
    data: { ...data, id: response.id }
  };
};

export const updateIssue = async (id, data) => {
  const mappedData = mapIssueToBackend(data);
  return await apiCall(`/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mappedData)
  });
};

export const deleteIssue = (id) => apiCall(`/issues/${id}`, {
  method: 'DELETE'
});

// People API
export const getPeople = async () => {
  const response = await apiCall('/people');
  return {
    ...response,
    data: response.data.map(mapPersonFromBackend)
  };
};

export const createPerson = async (data) => {
  const mappedData = mapPersonToBackend(data);
  const response = await apiCall('/people', {
    method: 'POST',
    body: JSON.stringify(mappedData)
  });
  
  return {
    ...response,
    data: { ...data, id: response.id }
  };
};

export const updatePerson = async (id, data) => {
  const mappedData = mapPersonToBackend(data);
  return await apiCall(`/people/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mappedData)
  });
};

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

// Generic CRUD operations with field mapping
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