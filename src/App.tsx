import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Coach } from './pages/Coach';
import { Tests } from './pages/Tests';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        isExpanded: boolean;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        if (!window.Telegram.WebApp.isExpanded) {
          window.Telegram.WebApp.expand();
        }
        setIsReady(true);
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
      // Still set ready to true to allow app to work in browser
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 