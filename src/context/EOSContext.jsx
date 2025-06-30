import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eosReducer, initialState } from './eosReducer';
import * as api from '../services/api';
import { useNotifications } from '../hooks/useNotifications';

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
      const [metrics, rocks, issues, people, meetings, todos, vision] = await Promise.all([
        api.getMetrics(),
        api.getRocks(),
        api.getIssues(),
        api.getPeople(),
        api.getMeetings(),
        api.getTodos(),
        api.getVision()
      ]);

      dispatch({ type: 'LOAD_INITIAL_DATA', payload: {
        metrics: metrics.data || [],
        rocks: rocks.data || [],
        issues: issues.data || [],
        people: people.data || [],
        meetings: meetings.data || [],
        todos: todos.data || [],
        vision: vision.data || {}
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
      const response = await api.createItem(type, data);
      if (response.success) {
        dispatch({ type: 'ADD_ITEM', payload: { type, item: data }});
        showNotification(`${type} created successfully!`, 'success');
        return response;
      }
    } catch (error) {
      showNotification(`Failed to create ${type}`, 'error');
      throw error;
    }
  };

  const updateItem = async (type, id, data) => {
    try {
      const response = await api.updateItem(type, id, data);
      if (response.success) {
        dispatch({ type: 'UPDATE_ITEM', payload: { type, id, item: data }});
        showNotification(`${type} updated successfully!`, 'success');
        return response;
      }
    } catch (error) {
      showNotification(`Failed to update ${type}`, 'error');
      throw error;
    }
  };

  const deleteItem = async (type, id) => {
    try {
      const response = await api.deleteItem(type, id);
      if (response.success) {
        dispatch({ type: 'DELETE_ITEM', payload: { type, id }});
        showNotification(`${type} deleted successfully!`, 'success');
        return response;
      }
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