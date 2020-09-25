import React from 'react';
import MaterialAppBar from './components/MaterialAppBar';
import HabitTracker from './components/HabitTracker';
import SmartGoalForm from './components/SmartGoalForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <MaterialAppBar/>
      {/* <HabitTracker/> */}
      <SmartGoalForm/>
    </div>
  );
}

export default App;
