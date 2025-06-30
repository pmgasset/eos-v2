import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';

const EmptyState = () => {
  const { dispatch } = useEOS();
  const { openModal } = useModal();

  return (
    <div className="empty-state">
      <h3>Welcome to your EOS Platform!</h3>
      <p>Get started by setting up your core EOS components.</p>
      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => openModal('metric')}>
          Add First Metric
        </button>
        <button className="btn btn-secondary" onClick={() => openModal('rock')}>
          Add First Rock
        </button>
        <button className="btn btn-secondary" onClick={() => openModal('person')}>
          Add Team Member
        </button>
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'vto' })}>
          Setup V/TO
        </button>
      </div>
    </div>
  );
};

export default EmptyState;