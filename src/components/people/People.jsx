import React from 'react';
import { useEOS } from '../../context/EOSContext';
import { useModal } from '../../hooks/useModal';
import PeopleTable from './PeopleTable';
import PersonForm from './PersonForm';
import GWCMatrix from './GWCMatrix';
import Modal from '../common/Modal';

const People = () => {
  const { people } = useEOS();
  const { showModal, modalType, modalData, openModal, closeModal } = useModal();

  const handleAddPerson = () => {
    openModal('person');
  };

  const handleEditPerson = (person) => {
    openModal('person', person);
  };

  const getPeopleStats = () => {
    const total = people.length;
    const rightPeopleRightSeat = people.filter(p => p.getIt && p.wantIt && p.capacity).length;
    const rightPeople = people.filter(p => p.getIt && p.wantIt).length;
    const wrongSeat = people.filter(p => p.getIt && p.wantIt && !p.capacity).length;
    const wrongPeople = people.filter(p => !p.getIt || !p.wantIt).length;
    
    const seats = [...new Set(people.map(p => p.seat))].filter(Boolean);
    const departments = [...new Set(people.map(p => p.department))].filter(Boolean);

    return { 
      total, 
      rightPeopleRightSeat, 
      rightPeople, 
      wrongSeat, 
      wrongPeople,
      uniqueSeats: seats.length,
      departments: departments.length
    };
  };

  const stats = getPeopleStats();

  return (
    <div className="people">
      <div className="section-header">
        <h2>People Analyzer - Right People, Right Seat</h2>
        <button className="btn btn-primary" onClick={handleAddPerson}>
          + Add Person
        </button>
      </div>

      {people.length > 0 && (
        <div className="people-stats">
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <h3>Right People, Right Seat</h3>
              <div className="stat-number" style={{ color: '#4caf50' }}>
                {stats.rightPeopleRightSeat}
              </div>
              <div className="stat-label">Out of {stats.total} People</div>
            </div>
            <div className="stat-card">
              <h3>Right People, Wrong Seat</h3>
              <div className="stat-number" style={{ color: '#ff9800' }}>
                {stats.wrongSeat}
              </div>
              <div className="stat-label">Need Role Adjustment</div>
            </div>
            <div className="stat-card">
              <h3>Wrong People</h3>
              <div className="stat-number" style={{ color: '#f44336' }}>
                {stats.wrongPeople}
              </div>
              <div className="stat-label">May Need Development</div>
            </div>
            <div className="stat-card">
              <h3>Organization</h3>
              <div className="stat-number">{stats.uniqueSeats}</div>
              <div className="stat-label">{stats.departments} Departments</div>
            </div>
          </div>
        </div>
      )}

      {people.length === 0 ? (
        <div className="empty-section">
          <h3>No team members added yet</h3>
          <p>Start building your accountability chart by adding team members and assessing their GWC (Get it, Want it, Capacity).</p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>The GWC Assessment:</h4>
            <ul style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <li><strong>Get It:</strong> They understand the role and responsibilities</li>
              <li><strong>Want It:</strong> They have the desire and motivation</li>
              <li><strong>Capacity:</strong> They have the time and capability to do the job</li>
            </ul>
          </div>
          <button className="btn btn-primary" onClick={handleAddPerson}>
            Add First Team Member
          </button>
        </div>
      ) : (
        <>
          <GWCMatrix people={people} />
          <PeopleTable 
            people={people} 
            onEditPerson={handleEditPerson}
          />
        </>
      )}

      <Modal
        show={showModal && modalType === 'person'}
        onClose={closeModal}
        title={modalData ? 'Edit Team Member' : 'Add Team Member'}
        size="lg"
      >
        <PersonForm
          initialData={modalData}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default People;