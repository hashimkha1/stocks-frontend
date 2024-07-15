// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StockList from './components/StockList';
import NavBar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/ChangePassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<StockList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/add-stock" element={<StockList />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
