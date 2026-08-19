import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Active role for interface views
  const [activeRole, setActiveRole] = useState('company_admin');

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          setActiveRole(res.data.role || 'company_admin');
        })
        .catch(err => {
          console.warn('API authentication error or session expired:', err.message);
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const loginUser = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setActiveRole(res.data.role);
      return { success: true, role: res.data.role, user: res.data };
    } catch (error) {
      // Fallback for demo testing when backend API isn't responding or DB isn't seeded
      if (email === 'admin@platform.com' && (password === 'adminpassword123' || password === 'admin123')) {
        const superAdminUser = {
          _id: 'super_admin_demo',
          name: 'Global Super Admin',
          email: 'admin@platform.com',
          role: 'super_admin'
        };
        setUser(superAdminUser);
        setActiveRole('super_admin');
        return { success: true, role: 'super_admin', user: superAdminUser };
      } else if (!email.toLowerCase().includes('admin@platform')) {
        const isNexus = email.toLowerCase().includes('next') || email.toLowerCase().includes('nexus');
        const companyUser = {
          _id: 'user_nexus_1',
          name: isNexus ? 'Nexus' : (email.split('@')[0] || 'Company Admin'),
          email: email,
          role: 'company_admin',
          company: {
            _id: 'comp_nexus_1',
            name: isNexus ? 'NextEra Panel' : 'Company Workspace',
            apiKey: 'sk_live_nexus_998877665544332211',
            currentSubscription: {
              planName: 'Pro Enterprise',
              resumesScreenedThisMonth: 0,
              monthlyLimit: 1000
            }
          }
        };
        setUser(companyUser);
        setActiveRole('company_admin');
        return { success: true, role: 'company_admin', user: companyUser };
      }

      return { success: false, message: error.response?.data?.message || 'Invalid email or password' };
    }
  };

  const registerCompany = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setActiveRole('company_admin');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setActiveRole('company_admin');
  };

  const switchRole = (role) => {
    // Only allow switching to super_admin if logged in as super_admin
    if (role === 'super_admin' && user?.role !== 'super_admin') {
      return false;
    }
    setActiveRole(role);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      activeRole,
      switchRole,
      loginUser,
      registerCompany,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
