import React from 'react';
import { EOSProvider } from './context/EOSContext';
import Navigation from './components/navigation/Navigation';
import MainContent from './components/MainContent';
import NotificationContainer from './components/common/NotificationContainer';
import './styles/global.css';

const App = () => {
  return (
    <EOSProvider>
      <div className="eos-platform">
        <Navigation />
        <MainContent />
        <NotificationContainer />
      </div>
    </EOSProvider>
  );
};

export default App;