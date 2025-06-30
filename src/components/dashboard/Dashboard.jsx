import React from 'react';
import { useEOS } from '../../context/EOSContext';
import StatCard from './StatCard';
import EmptyState from '../common/EmptyState';

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

  return (
    <div className="dashboard">
      <h2>EOS Dashboard</h2>
      
      <div className="stats-grid">
        <StatCard
          title="Scorecard Metrics"
          value={`${stats.onTrackMetrics}/${stats.totalMetrics}`}
          label="On Track"
        />
        <StatCard
          title="Rock Progress"
          value={`${stats.avgRockProgress}%`}
          label="Average Progress"
        />
        <StatCard
          title="Issues"
          value={stats.totalIssues}
          label={`${stats.highPriorityIssues} High Priority`}
        />
        <StatCard
          title="Team"
          value={`${stats.rightPeopleSeat}/${stats.totalPeople}`}
          label="Right People, Right Seat"
        />
        <StatCard
          title="Meetings & To-Dos"
          value={stats.upcomingMeetings}
          label={`${stats.pendingTodos} Pending To-Dos`}
        />
        <StatCard
          title="Vision"
          value={stats.coreValuesCount}
          label="Core Values Defined"
        />
      </div>
    </div>
  );
};

export default Dashboard;