import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Section00Page from './pages/Section00Page';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/section00" element={<Section00Page />} />
      </Routes>
    </Router>
  );
}

export default App;
