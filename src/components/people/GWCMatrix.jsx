import React from 'react';

const GWCMatrix = ({ people }) => {
  const getGWCCategory = (person) => {
    const { getIt, wantIt, capacity } = person;
    
    if (getIt && wantIt && capacity) return 'rightPersonRightSeat';
    if (getIt && wantIt && !capacity) return 'rightPersonWrongSeat';
    if (!getIt && wantIt && capacity) return 'needsTraining';
    if (getIt && !wantIt && capacity) return 'needsMotivation';
    if (!getIt && !wantIt && capacity) return 'wrongPerson';
    if (getIt && wantIt && !capacity) return 'wrongSeat';
    if (!getIt && wantIt && !capacity) return 'needsDevelopment';
    if (getIt && !wantIt && !capacity) return 'needsNewRole';
    return 'wrongPerson'; // Default for !getIt && !wantIt && !capacity
  };

  const categorizepeople = () => {
    const categories = {
      rightPersonRightSeat: [],
      rightPersonWrongSeat: [],
      needsTraining: [],
      needsMotivation: [],
      wrongSeat: [],
      needsDevelopment: [],
      needsNewRole: [],
      wrongPerson: []
    };

    people.forEach(person => {
      const category = getGWCCategory(person);
      categories[category].push(person);
    });

    return categories;
  };

  const categories = categorizepeople();

  const matrixData = [
    {
      title: '✅ Right Person, Right Seat',
      description: 'Perfect fit - Get it, Want it, Capacity',
      people: categories.rightPersonRightSeat,
      color: '#4caf50',
      action: 'Keep them happy and growing'
    },
    {
      title: '⚠️ Right Person, Wrong Seat',
      description: 'Get it, Want it, but lack Capacity',
      people: categories.rightPersonWrongSeat,
      color: '#ff9800',
      action: 'Find them the right seat'
    },
    {
      title: '📚 Needs Training',
      description: 'Want it, have Capacity, but don\'t Get it yet',
      people: categories.needsTraining,
      color: '#2196f3',
      action: 'Invest in training and development'
    },
    {
      title: '🔥 Needs Motivation',
      description: 'Get it, have Capacity, but don\'t Want it',
      people: categories.needsMotivation,
      color: '#9c27b0',
      action: 'Find out what motivates them'
    },
    {
      title: '🔄 Needs Development',
      description: 'Want it but missing other elements',
      people: categories.needsDevelopment,
      color: '#ff5722',
      action: 'Comprehensive development plan'
    },
    {
      title: '❌ Wrong Person',
      description: 'Missing multiple GWC elements',
      people: categories.wrongPerson,
      color: '#f44336',
      action: 'Consider if this is the right fit'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>GWC Assessment Matrix</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem' 
      }}>
        {matrixData.map((category, index) => (
          <div 
            key={index}
            style={{
              padding: '1rem',
              border: `2px solid ${category.color}40`,
              borderRadius: '8px',
              backgroundColor: `${category.color}10`
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '0.5rem'
            }}>
              <h4 style={{ 
                margin: 0,
                color: category.color,
                fontSize: '1rem'
              }}>
                {category.title}
              </h4>
              <span style={{
                marginLeft: 'auto',
                background: category.color,
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {category.people.length}
              </span>
            </div>
            
            <p style={{ 
              fontSize: '0.8rem', 
              color: '#666', 
              margin: '0 0 0.5rem 0' 
            }}>
              {category.description}
            </p>
            
            <div style={{ 
              fontSize: '0.75rem', 
              color: category.color,
              fontWeight: 'bold',
              marginBottom: '0.75rem'
            }}>
              💡 {category.action}
            </div>

            {category.people.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {category.people.map(person => (
                  <span
                    key={person.id}
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'white',
                      border: `1px solid ${category.color}60`,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: category.color
                    }}
                  >
                    {person.name}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ 
                fontStyle: 'italic', 
                color: '#999', 
                fontSize: '0.8rem' 
              }}>
                No team members in this category
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick GWC Legend */}
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>GWC Quick Reference</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
          <div>
            <strong style={{ color: '#4caf50' }}>Get It (G)</strong>
            <div style={{ color: '#666' }}>Understands the role, responsibilities, and expectations clearly</div>
          </div>
          <div>
            <strong style={{ color: '#2196f3' }}>Want It (W)</strong>
            <div style={{ color: '#666' }}>Has genuine desire, passion, and motivation for the role</div>
          </div>
          <div>
            <strong style={{ color: '#ff9800' }}>Capacity (C)</strong>
            <div style={{ color: '#666' }}>Has the mental, physical, and emotional capacity to excel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GWCMatrix;