import React, { useState } from 'react';
import './App.css';
import AddCandidate from './components/AddCandidate';
import CandidateList from './components/CandidateList';

type View = 'home' | 'add-candidate';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">LTI - Talent Tracking System</h1>
          <div className="nav-links">
            <button 
              className={currentView === 'home' ? 'active' : ''} 
              onClick={() => setCurrentView('home')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn-primary ${currentView === 'add-candidate' ? 'active' : ''}`}
              onClick={() => setCurrentView('add-candidate')}
            >
              + Add Candidate
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'home' && (
          <CandidateList />
        )}

        {currentView === 'add-candidate' && (
          <AddCandidate onSuccess={() => setCurrentView('home')} />
        )}
      </main>
    </div>
  );
}

export default App;

