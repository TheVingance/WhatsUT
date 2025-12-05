import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { SocketProvider } from './SocketContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" />;
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <AppRoutes />
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
