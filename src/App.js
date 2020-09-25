import React from 'react';
import MaterialAppBar from './components/MaterialAppBar';
import HabitTracker from './components/HabitTracker';
import './App.css';

function App() {
  return (
    <div className="App">
      <MaterialAppBar/>
      <HabitTracker/>
    </div>
  );
}

export default App;
