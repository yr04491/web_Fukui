import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Section00Page from './pages/Section00Page';
import Section01Page from './pages/Section01Page';
import Section02Page from './pages/Section02Page';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router basename="/web_Fukui">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/section00" element={<Section00Page />} />
        <Route path="/section01" element={<Section01Page />} />
        <Route path="/section02" element={<Section02Page />} />
      </Routes>
    </Router>
  );
}

export default App;
