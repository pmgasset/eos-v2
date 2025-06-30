import React from 'react';
import { useEOS } from '../context/EOSContext';
import Dashboard from './dashboard/Dashboard';
import Scorecard from './scorecard/Scorecard';
import Rocks from './rocks/Rocks';
import Issues from './issues/Issues';
import VTO from './vto/VTO';
import L10Meetings from './meetings/L10Meetings';
import People from './people/People';
import Integrations from './integrations/Integrations';

const MainContent = () => {
  const { currentView } = useEOS();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'scorecard': return <Scorecard />;
      case 'rocks': return <Rocks />;
      case 'issues': return <Issues />;
      case 'vto': return <VTO />;
      case 'l10': return <L10Meetings />;
      case 'people': return <People />;
      case 'integrations': return <Integrations />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="main-content">
      {renderContent()}
    </div>
  );
};

export default MainContent;