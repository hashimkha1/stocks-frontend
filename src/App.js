import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StockList from './components/StockList';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/stocks" element={<Login />} />
          <Route path="/stocks/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/stocks/home" element={
           <ProtectedRoute>
              <StockList />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
