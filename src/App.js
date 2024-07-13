// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import StockList from './components/StockList';
import AddStock from './components/AddStock';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<StockList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-stock" element={<AddStock />} />
      </Routes>
    </Router>
  );
};

export default App;
