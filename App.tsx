import React, { useState, useEffect } from 'react';
import { Home } from './views/Home';
import { Lobby } from './views/Lobby';
import { Meeting } from './views/Meeting';
import { Summary } from './views/Summary';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { AppView, UserSettings } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [meetingId, setMeetingId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // App-wide state simulating User Context
  const [userSettings, setUserSettings] = useState<UserSettings>({
    displayName: 'کاربر مهمان',
    videoDeviceId: 'default',
    audioDeviceId: 'default',
    audioOutputId: 'default',
    videoEnabled: true,
    audioEnabled: true,
    theme: 'dark',
    lowDataMode: false,
  });

  const updateSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...updates }));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserSettings(prev => ({ ...prev, displayName: 'مدیر سیستم' }));
    setCurrentView(AppView.HOME);
  };

  // Handle Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (userSettings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userSettings.theme]);

  // View Router
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <Home 
            onChangeView={setCurrentView} 
            setMeetingId={setMeetingId} 
            isAuthenticated={isAuthenticated}
            userSettings={userSettings}
          />
        );
      case AppView.LOGIN:
        return (
          <Login 
            onChangeView={setCurrentView}
            onLogin={handleLogin}
          />
        );
      case AppView.SIGNUP:
        return (
          <Signup 
            onChangeView={setCurrentView}
          />
        );
      case AppView.LOBBY:
        return (
          <Lobby 
            onChangeView={setCurrentView} 
            userSettings={userSettings}
            updateSettings={updateSettings}
            meetingId={meetingId}
          />
        );
      case AppView.MEETING:
        return (
          <Meeting 
            onChangeView={setCurrentView} 
            meetingId={meetingId}
            userSettings={userSettings}
          />
        );
      case AppView.SUMMARY:
        return (
          <Summary 
            onChangeView={setCurrentView} 
          />
        );
      case AppView.SETTINGS:
        // Reuse Lobby settings for now or create specific page
        return <Home 
          onChangeView={setCurrentView} 
          setMeetingId={setMeetingId} 
          isAuthenticated={isAuthenticated} 
          userSettings={userSettings}
        />; 
      default:
        return (
          <Home 
            onChangeView={setCurrentView} 
            setMeetingId={setMeetingId} 
            isAuthenticated={isAuthenticated}
            userSettings={userSettings}
          />
        );
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default App;