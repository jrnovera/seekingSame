import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Properties from './components/Properties/Properties';
import Settings from './components/Settings/Settings';
import Users from './components/Users/Users';
import Layout from './components/Layout/Layout';
import ChatPage from './components/Chat/ChatPage';
import Transactions from './components/Transactions/Transactions';
import Notifications from './components/Notifications/Notifications';
import { AuthProvider, useAuth } from './context/AuthContext';
import VerificationModal from './components/Auth/VerificationModal';
import Subscribe from './components/Subscribe/Subscribe';
import CheckoutHandler from './components/Subscribe/CheckoutHandler';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <CheckoutHandler />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="chat" element={<HostOnlyRoute><ChatPage /></HostOnlyRoute>} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
              <Route path="subscribe" element={<AdminRoute><Subscribe /></AdminRoute>} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // If user is not admin and not verified, block with modal
  if ((user.role || '').toLowerCase() !== 'admin' && user.isVerified !== true) {
    return <VerificationModal />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

// Only allow hosts to access certain routes (e.g., Chat)
function HostOnlyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'host') return <Navigate to="/" />;
  return children;
}

export default App;
