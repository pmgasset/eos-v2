export const API_BASE = 'https://eos-platform-api.traveldata.workers.dev/api/v1';
export const GHL_WEBHOOK = 'https://eos-platform-api.traveldata.workers.dev/api/ghl/webhook';

export const SEAT_OPTIONS = [
  'Visionary',
  'Integrator', 
  'Sales',
  'Marketing',
  'Operations',
  'Finance',
  'Admin'
];

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export const STATUS_OPTIONS = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'on-track', label: 'On Track' },
  { value: 'behind', label: 'Behind' },
  { value: 'exceeded', label: 'Exceeded Goal' }
];