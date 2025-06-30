import React from 'react';
import { useEOS } from '../../context/EOSContext';

const MetricsTable = ({ metrics, onEditMetric }) => {
  const { deleteItem } = useEOS();

  const getMetricStatus = (actual, goal) => {
    if (!actual || !goal) return 'unknown';
    const percentage = (actual / goal) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'on-track';
    return 'behind';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'on-track': 'On Track',
      'behind': 'Behind',
      'exceeded': 'Exceeded',
      'unknown': 'No Data'
    };
    return labels[status] || 'Unknown';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      await deleteItem('metric', id);
    }
  };

  const formatNumber = (value) => {
    if (!value) return '—';
    return new Intl.NumberFormat().format(value);
  };

  return (
    <div className="table-container">
      <table className="eos-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Goal</th>
            <th>Actual</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => {
            const status = getMetricStatus(metric.actual, metric.goal);
            return (
              <tr key={metric.id}>
                <td>
                  <strong>{metric.name}</strong>
                  {metric.description && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      {metric.description}
                    </div>
                  )}
                </td>
                <td>{formatNumber(metric.goal)}</td>
                <td>{formatNumber(metric.actual)}</td>
                <td>
                  <span className={`status ${status}`}>
                    {getStatusLabel(status)}
                  </span>
                </td>
                <td>{metric.owner}</td>
                <td style={{ textTransform: 'capitalize' }}>{metric.frequency}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEditMetric(metric)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(metric.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsTable;