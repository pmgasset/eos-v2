// Placeholder API service
export const getMetrics = () => Promise.resolve({ data: [] });
export const getRocks = () => Promise.resolve({ data: [] });
export const getIssues = () => Promise.resolve({ data: [] });
export const getPeople = () => Promise.resolve({ data: [] });
export const getMeetings = () => Promise.resolve({ data: [] });
export const getTodos = () => Promise.resolve({ data: [] });
export const getVision = () => Promise.resolve({ data: {} });

export const createItem = (type, data) => Promise.resolve({ success: true });
export const updateItem = (type, id, data) => Promise.resolve({ success: true });
export const deleteItem = (type, id) => Promise.resolve({ success: true });