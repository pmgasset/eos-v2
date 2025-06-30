import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eosReducer, initialState } from './eosReducer';
import * as api from '../services/api';

// Simple notification hook inline
const useNotifications = () => {
  const showNotification = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };
  return { showNotification };
};

const EOSContext = createContext();

export const useEOS = () => {
  const context = useContext(EOSContext);
  if (!context) {
    throw new Error('useEOS must be used within an EOSProvider');
  }
  return context;
};

export const EOSProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eosReducer, initialState);
  const { showNotification } = useNotifications();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API calls for now
      dispatch({ type: 'LOAD_INITIAL_DATA', payload: {
        metrics: [],
        rocks: [],
        issues: [],
        people: [],
        meetings: [],
        todos: [],
        vision: {
          coreValues: [],
          coreFocus: { purpose: '', niche: '' },
          tenYearTarget: '',
          marketingStrategy: '',
          threeYearPicture: '',
          oneYearPlan: ''
        }
      }});

      dispatch({ type: 'SET_API_STATUS', payload: 'connected' });
    } catch (error) {
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
      showNotification('Failed to load data', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createItem = async (type, data) => {
    try {
      // Simulate API call
      dispatch({ type: 'ADD_ITEM', payload: { type, item: { ...data, id: Date.now().toString() } }});
      showNotification(`${type} created successfully!`, 'success');
      return { success: true };
    } catch (error) {
      showNotification(`Failed to create ${type}`, 'error');
      throw error;
    }
  };

  const updateItem = async (type, id, data) => {
    try {
      // Simulate API call
      dispatch({ type: 'UPDATE_ITEM', payload: { type, id, item: data }});
      showNotification(`${type} updated successfully!`, 'success');
      return { success: true };
    } catch (error) {
      showNotification(`Failed to update ${type}`, 'error');
      throw error;
    }
  };

  const deleteItem = async (type, id) => {
    try {
      // Simulate API call
      dispatch({ type: 'DELETE_ITEM', payload: { type, id }});
      showNotification(`${type} deleted successfully!`, 'success');
      return { success: true };
    } catch (error) {
      showNotification(`Failed to delete ${type}`, 'error');
      throw error;
    }
  };

  const value = {
    ...state,
    dispatch,
    createItem,
    updateItem,
    deleteItem,
    loadInitialData
  };

  return (
    <EOSContext.Provider value={value}>
      {children}
    </EOSContext.Provider>
  );
};