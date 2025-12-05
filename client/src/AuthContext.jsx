import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Ideally verify token with backend here, or decode it
            // For now we just assume it's valid if present, but we need user info.
            // We'll rely on login setting the user state.
            // If page refresh, we might lose user info if not stored.
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:3000/login', { username, password });
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:3000/register', { username, password });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
