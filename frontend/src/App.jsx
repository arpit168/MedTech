// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrescriptionDigitizer from './pages/PrescriptionDigitizer';
import SymptomTracker from './pages/SymptomTracker';
import ReportOrganizer from './pages/ReportOrganizer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prescription" 
          element={
            <ProtectedRoute>
              <PrescriptionDigitizer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/symptom-tracker" 
          element={
            <ProtectedRoute>
              <SymptomTracker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportOrganizer />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
