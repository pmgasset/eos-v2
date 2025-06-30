import React from 'react';
import { useEOS } from '../../context/EOSContext';

const PeopleTable = ({ people, onEditPerson }) => {
  const { deleteItem } = useEOS();

  const getGWCStatus = (person) => {
    const { getIt, wantIt, capacity } = person;
    
    if (getIt && wantIt && capacity) return 'right-person-right-seat';
    if (getIt && wantIt && !capacity) return 'right-person-wrong-seat';
    if (getIt && wantIt) return 'right-person';
    return 'wrong-person';
  };

  const getGWCLabel = (status) => {
    const labels = {
      'right-person-right-seat': 'Right Person, Right Seat',
      'right-person-wrong-seat': 'Right Person, Wrong Seat',
      'right-person': 'Right Person',
      'wrong-person': 'Wrong Person'
    };
    return labels[status] || 'Unknown';
  };

  const getGWCColor = (status) => {
    const colors = {
      'right-person-right-seat': '#4caf50',
      'right-person-wrong-seat': '#ff9800', 
      'right-person': '#2196f3',
      'wrong-person': '#f44336'
    };
    return colors[status] || '#666';
  };

  const renderGWCIndicator = (person) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        <div 
          title={`Get It: ${person.getIt ? 'Yes' : 'No'}`}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: person.getIt ? '#4caf50' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          G
        </div>
        <div 
          title={`Want It: ${person.wantIt ? 'Yes' : 'No'}`}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: person.wantIt ? '#4caf50' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          W
        </div>
        <div 
          title={`Capacity: ${person.capacity ? 'Yes' : 'No'}`}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: person.capacity ? '#4caf50' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          C
        </div>
      </div>
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      await deleteItem('person', id);
    }
  };

  // Sort people: Right Person Right Seat first, then by name
  const sortedPeople = [...people].sort((a, b) => {
    const statusA = getGWCStatus(a);
    const statusB = getGWCStatus(b);
    
    // Priority order for statuses
    const statusOrder = {
      'right-person-right-seat': 4,
      'right-person-wrong-seat': 3,
      'right-person': 2,
      'wrong-person': 1
    };
    
    const statusDiff = statusOrder[statusB] - statusOrder[statusA];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Team Members</h3>
      <div className="table-container">
        <table className="eos-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Seat</th>
              <th>Department</th>
              <th>GWC Assessment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPeople.map(person => {
              const status = getGWCStatus(person);
              
              return (
                <tr key={person.id}>
                  <td>
                    <strong>{person.name}</strong>
                  </td>
                  <td>{person.role}</td>
                  <td>{person.seat}</td>
                  <td>{person.department || '—'}</td>
                  <td>
                    {renderGWCIndicator(person)}
                  </td>
                  <td>
                    <span 
                      className="status"
                      style={{ 
                        backgroundColor: getGWCColor(status) + '20',
                        color: getGWCColor(status),
                        border: `1px solid ${getGWCColor(status)}40`
                      }}
                    >
                      {getGWCLabel(status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEditPerson(person)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(person.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeopleTable;