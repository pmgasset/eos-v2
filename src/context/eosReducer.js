export const initialState = {
  currentView: 'dashboard',
  isLoading: false,
  apiStatus: 'disconnected',
  metrics: [],
  rocks: [],
  issues: [],
  meetings: [],
  people: [],
  todos: [],
  visionData: {
    coreValues: [],
    coreFocus: { purpose: '', niche: '' },
    tenYearTarget: '',
    marketingStrategy: '',
    threeYearPicture: '',
    oneYearPlan: ''
  },
  ghlConfig: {
    apiKey: '',
    locationId: '',
    webhookUrl: '',
    syncContacts: true,
    syncOpportunities: true,
    eosTagRequired: true,
    lastSync: null,
    isConnected: false
  }
};

export const eosReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_API_STATUS':
      return { ...state, apiStatus: action.payload };
    
    case 'LOAD_INITIAL_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_ITEM':
      const { type: addType, item } = action.payload;
      return {
        ...state,
        [addType === 'person' ? 'people' : `${addType}s`]: [
          ...state[addType === 'person' ? 'people' : `${addType}s`],
          item
        ]
      };
    
    case 'UPDATE_ITEM':
      const { type: updateType, id, item: updatedItem } = action.payload;
      const arrayKey = updateType === 'person' ? 'people' : `${updateType}s`;
      return {
        ...state,
        [arrayKey]: state[arrayKey].map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      };
    
    case 'DELETE_ITEM':
      const { type: deleteType, id: deleteId } = action.payload;
      const deleteArrayKey = deleteType === 'person' ? 'people' : `${deleteType}s`;
      return {
        ...state,
        [deleteArrayKey]: state[deleteArrayKey].filter(item => item.id !== deleteId)
      };
    
    case 'UPDATE_GHL_CONFIG':
      return { ...state, ghlConfig: { ...state.ghlConfig, ...action.payload }};
    
    case 'UPDATE_VISION':
      return { ...state, visionData: { ...state.visionData, ...action.payload }};
    
    default:
      return state;
  }
};