import React from 'react';
import { useEOS } from '../../context/EOSContext';
import StatCard from './StatCard';
import EmptyState from '../common/EmptyState';
import './Dashboard.css'; // Import the dashboard-specific styles

const Dashboard = () => {
  const { metrics, rocks, issues, people, meetings, todos, visionData } = useEOS();

  const stats = {
    totalMetrics: metrics.length,
    onTrackMetrics: metrics.filter(m => m.status === 'on-track').length,
    totalRocks: rocks.length,
    completedRocks: rocks.filter(r => r.progress >= 100).length,
    totalIssues: issues.length,
    highPriorityIssues: issues.filter(i => i.priority === 'high').length,
    avgRockProgress: rocks.length > 0 ? Math.round(rocks.reduce((sum, r) => sum + (r.progress || 0), 0) / rocks.length) : 0,
    totalPeople: people.length,
    rightPeopleSeat: people.filter(p => p.getIt && p.wantIt && p.capacity).length,
    upcomingMeetings: meetings.filter(m => new Date(m.date) > new Date()).length,
    pendingTodos: todos.filter(t => !t.completed).length,
    coreValuesCount: visionData.coreValues.length
  };

  const hasData = metrics.length > 0 || rocks.length > 0 || issues.length > 0 || people.length > 0;

  if (!hasData) {
    return <EmptyState />;
  }

  // Calculate completion percentages and status colors
  const scorecardStatus = stats.totalMetrics > 0 ? (stats.onTrackMetrics / stats.totalMetrics) * 100 : 0;
  const teamStatus = stats.totalPeople > 0 ? (stats.rightPeopleSeat / stats.totalPeople) * 100 : 0;

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>EOS Dashboard</h2>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Scorecard Metrics"
          value={`${stats.onTrackMetrics}/${stats.totalMetrics}`}
          label="On Track"
          color={getStatusColor(scorecardStatus)}
          icon="📊"
        />
        
        <StatCard
          title="Rock Progress"
          value={`${stats.avgRockProgress}%`}
          label="Average Progress"
          color={getStatusColor(stats.avgRockProgress)}
          icon="🎯"
        />
        
        <StatCard
          title="Issues"
          value={stats.totalIssues}
          label={`${stats.highPriorityIssues} High Priority`}
          color={stats.highPriorityIssues > 0 ? '#ef4444' : '#10b981'}
          icon="⚠️"
        />
        
        <StatCard
          title="Team"
          value={`${stats.rightPeopleSeat}/${stats.totalPeople}`}
          label="Right People, Right Seat"
          color={getStatusColor(teamStatus)}
          icon="👥"
        />
        
        <StatCard
          title="Meetings & To-Dos"
          value={stats.upcomingMeetings}
          label={`${stats.pendingTodos} Pending To-Dos`}
          color="#6366f1"
          icon="📅"
        />
        
        <StatCard
          title="Vision"
          value={stats.coreValuesCount}
          label="Core Values Defined"
          color={stats.coreValuesCount >= 3 ? '#10b981' : '#f59e0b'}
          icon="👁️"
        />
      </div>

      {/* Quick Insights Section */}
      {(scorecardStatus < 80 || teamStatus < 80 || stats.highPriorityIssues > 0) && (
        <div className="dashboard-insights">
          <h3>🎯 Focus Areas</h3>
          
          <div className="insights-grid">
            {scorecardStatus < 80 && (
              <div className="insight-card insight-warning">
                <strong>Scorecard Attention Needed</strong>
                <p>
                  Only {Math.round(scorecardStatus)}% of metrics are on track. Review underperforming numbers.
                </p>
              </div>
            )}
            
            {teamStatus < 80 && (
              <div className="insight-card insight-info">
                <strong>Team Development Opportunity</strong>
                <p>
                  {stats.totalPeople - stats.rightPeopleSeat} team member(s) need GWC development.
                </p>
              </div>
            )}
            
            {stats.highPriorityIssues > 0 && (
              <div className="insight-card insight-danger">
                <strong>High Priority Issues</strong>
                <p>
                  {stats.highPriorityIssues} high priority issue(s) need immediate attention.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;