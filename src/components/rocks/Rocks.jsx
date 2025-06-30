import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';
import RocksTable from './RocksTable';
import RockForm from './RockForm';
import Modal from '../common/Modal';

const Rocks = () => {
  const { rocks } = useEOS();
  const { showModal, modalType, modalData, openModal, closeModal } = useModal();

  const handleAddRock = () => {
    openModal('rock');
  };

  const handleEditRock = (rock) => {
    openModal('rock', rock);
  };

  const getQuarterStats = () => {
    const total = rocks.length;
    const completed = rocks.filter(r => r.progress >= 100).length;
    const onTrack = rocks.filter(r => r.progress >= 70 && r.progress < 100).length;
    const behind = rocks.filter(r => r.progress < 70).length;
    const avgProgress = total > 0 ? Math.round(rocks.reduce((sum, r) => sum + (r.progress || 0), 0) / total) : 0;

    return { total, completed, onTrack, behind, avgProgress };
  };

  const stats = getQuarterStats();

  return (
    <div className="rocks">
      <div className="section-header">
        <h2>Rocks - 90-Day Priorities</h2>
        <button className="btn btn-primary" onClick={handleAddRock}>
          + Add Rock
        </button>
      </div>

      {rocks.length > 0 && (
        <div className="rocks-stats">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <h3>Quarter Progress</h3>
              <div className="stat-number">{stats.avgProgress}%</div>
              <div className="stat-label">Average Completion</div>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Out of {stats.total} Rocks</div>
            </div>
            <div className="stat-card">
              <h3>On Track</h3>
              <div className="stat-number">{stats.onTrack}</div>
              <div className="stat-label">Making Good Progress</div>
            </div>
            <div className="stat-card">
              <h3>Behind</h3>
              <div className="stat-number">{stats.behind}</div>
              <div className="stat-label">Need Attention</div>
            </div>
          </div>
        </div>
      )}

      {rocks.length === 0 ? (
        <div className="empty-section">
          <h3>No rocks set for this quarter</h3>
          <p>Set your 90-day priorities to drive focus and accountability.</p>
          <button className="btn btn-primary" onClick={handleAddRock}>
            Add First Rock
          </button>
        </div>
      ) : (
        <RocksTable 
          rocks={rocks} 
          onEditRock={handleEditRock}
        />
      )}

      <Modal
        show={showModal && modalType === 'rock'}
        onClose={closeModal}
        title={modalData ? 'Edit Rock' : 'Add New Rock'}
        size="lg"
      >
        <RockForm
          initialData={modalData}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Rocks;