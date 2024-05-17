import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MediaSection from './components/MediaSection';
import GenresSection from './components/GenresSection';
import '../src/assets/css/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/media" element={<MediaSection />} />
          <Route path="/genres" element={<GenresSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
