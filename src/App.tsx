
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import { AuthProvider } from './components/AuthProvider';
import MyAccount from './pages/MyAccount';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/account" element={<MyAccount />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
