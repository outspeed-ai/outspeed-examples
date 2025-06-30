import logo from './logo.svg';
import './App.css';
import React from 'react';
import VoiceChat from './VoiceChat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{ marginTop: 20 }}>
          <VoiceChat />
        </div>
      </header>
    </div>
  );
}

export default App;
