import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';
import MetricsTable from './MetricsTable';
import MetricForm from './MetricForm';
import Modal from '../common/Modal';

const Scorecard = () => {
  const { metrics } = useEOS();
  const { showModal, modalType, modalData, openModal, closeModal } = useModal();

  const handleAddMetric = () => {
    openModal('metric');
  };

  const handleEditMetric = (metric) => {
    openModal('metric', metric);
  };

  return (
    <div className="scorecard">
      <div className="section-header">
        <h2>Scorecard - Company Vital Signs</h2>
        <button className="btn btn-primary" onClick={handleAddMetric}>
          + Add Metric
        </button>
      </div>

      {metrics.length === 0 ? (
        <div className="empty-section">
          <h3>No metrics yet</h3>
          <p>Start tracking your company's vital signs by adding your first metric.</p>
          <button className="btn btn-primary" onClick={handleAddMetric}>
            Add First Metric
          </button>
        </div>
      ) : (
        <MetricsTable 
          metrics={metrics} 
          onEditMetric={handleEditMetric}
        />
      )}

      <Modal
        show={showModal && modalType === 'metric'}
        onClose={closeModal}
        title={modalData ? 'Edit Metric' : 'Add New Metric'}
        size="md"
      >
        <MetricForm
          initialData={modalData}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Scorecard;