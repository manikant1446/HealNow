import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const defaultAuth = {
  user: null, loading: true, login: async () => {}, register: async () => {},
  logout: () => {}, isAuthenticated: false, role: null
};
const AuthContext = createContext(defaultAuth);

// Axios interceptor: always attach token from localStorage on every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('healnow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Axios interceptor: handle 401 responses globally (auto-logout)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healnow_token');
      localStorage.removeItem('healnow_user');
      // Only redirect if not already on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('healnow_user');
    const token = localStorage.getItem('healnow_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const data = res.data;
    localStorage.setItem('healnow_token', data.token);
    localStorage.setItem('healnow_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);
    const data = res.data;
    localStorage.setItem('healnow_token', data.token);
    localStorage.setItem('healnow_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('healnow_token');
    localStorage.removeItem('healnow_user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const role = user?.role;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
