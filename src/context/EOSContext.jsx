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
      // Load all data from D1 in parallel
      const [
        metricsResponse,
        rocksResponse,
        issuesResponse,
        peopleResponse,
        meetingsResponse,
        todosResponse,
        visionResponse
      ] = await Promise.allSettled([
        api.getMetrics(),
        api.getRocks(),
        api.getIssues(),
        api.getPeople(),
        api.getMeetings(),
        api.getTodos(),
        api.getVision()
      ]);

      // Process responses and handle any failures gracefully
      const loadedData = {
        metrics: metricsResponse.status === 'fulfilled' ? metricsResponse.value.data || [] : [],
        rocks: rocksResponse.status === 'fulfilled' ? rocksResponse.value.data || [] : [],
        issues: issuesResponse.status === 'fulfilled' ? issuesResponse.value.data || [] : [],
        people: peopleResponse.status === 'fulfilled' ? peopleResponse.value.data || [] : [],
        meetings: meetingsResponse.status === 'fulfilled' ? meetingsResponse.value.data || [] : [],
        todos: todosResponse.status === 'fulfilled' ? todosResponse.value.data || [] : [],
        visionData: visionResponse.status === 'fulfilled' ? 
          visionResponse.value.data || initialState.visionData : 
          initialState.visionData
      };

      dispatch({ type: 'LOAD_INITIAL_DATA', payload: loadedData });
      dispatch({ type: 'SET_API_STATUS', payload: 'connected' });
      
      // Log any failed requests
      const failedRequests = [
        { name: 'metrics', response: metricsResponse },
        { name: 'rocks', response: rocksResponse },
        { name: 'issues', response: issuesResponse },
        { name: 'people', response: peopleResponse },
        { name: 'meetings', response: meetingsResponse },
        { name: 'todos', response: todosResponse },
        { name: 'vision', response: visionResponse }
      ].filter(req => req.response.status === 'rejected');

      if (failedRequests.length > 0) {
        console.warn('Some data failed to load:', failedRequests);
        showNotification(`Failed to load some data. Check connection.`, 'warning');
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
      showNotification('Failed to connect to server', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createItem = async (type, data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call D1 API
      const response = await api.createItem(type, data);
      
      // Update local state with the returned data (includes server-generated ID)
      const newItem = response.data || { ...data, id: response.id || Date.now().toString() };
      dispatch({ type: 'ADD_ITEM', payload: { type, item: newItem } });
      
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`, 'success');
      return { success: true, data: newItem };
      
    } catch (error) {
      console.error(`Failed to create ${type}:`, error);
      showNotification(`Failed to create ${type}. Please try again.`, 'error');
      
      // If API fails, still add to local state with warning
      const tempItem = { ...data, id: `temp-${Date.now()}`, _isTemporary: true };
      dispatch({ type: 'ADD_ITEM', payload: { type, item: tempItem } });
      showNotification(`${type} added locally. Will sync when connection is restored.`, 'warning');
      
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateItem = async (type, id, data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call D1 API
      const response = await api.updateItem(type, id, data);
      
      // Update local state
      const updatedItem = response.data || { ...data, id };
      dispatch({ type: 'UPDATE_ITEM', payload: { type, id, item: updatedItem } });
      
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, 'success');
      return { success: true, data: updatedItem };
      
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
      showNotification(`Failed to update ${type}. Please try again.`, 'error');
      
      // If API fails, still update local state with warning
      dispatch({ type: 'UPDATE_ITEM', payload: { type, id, item: { ...data, _isTemporary: true } } });
      showNotification(`${type} updated locally. Will sync when connection is restored.`, 'warning');
      
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteItem = async (type, id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call D1 API
      await api.deleteItem(type, id);
      
      // Update local state
      dispatch({ type: 'DELETE_ITEM', payload: { type, id } });
      
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
      return { success: true };
      
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      showNotification(`Failed to delete ${type}. Please try again.`, 'error');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateVision = async (visionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call D1 API
      const response = await api.updateVision(visionData);
      
      // Update local state
      const updatedVision = response.data || visionData;
      dispatch({ type: 'UPDATE_VISION', payload: updatedVision });
      
      showNotification('Vision updated successfully!', 'success');
      return { success: true, data: updatedVision };
      
    } catch (error) {
      console.error('Failed to update vision:', error);
      showNotification('Failed to update vision. Please try again.', 'error');
      
      // If API fails, still update local state with warning
      dispatch({ type: 'UPDATE_VISION', payload: { ...visionData, _isTemporary: true } });
      showNotification('Vision updated locally. Will sync when connection is restored.', 'warning');
      
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    dispatch,
    createItem,
    updateItem,
    deleteItem,
    updateVision,
    loadInitialData
  };

  return (
    <EOSContext.Provider value={value}>
      {children}
    </EOSContext.Provider>
  );
};