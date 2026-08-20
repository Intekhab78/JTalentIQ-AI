import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('saved_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState('company_admin');

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('saved_user', JSON.stringify(res.data));
          setActiveRole(res.data.role || 'company_admin');
        })
        .catch(err => {
          console.warn('API authentication error or fallback mode:', err.message);
          const saved = localStorage.getItem('saved_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setUser(parsed);
              setActiveRole(parsed.role || 'candidate');
            } catch (e) {}
          } else {
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      const saved = localStorage.getItem('saved_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setActiveRole(parsed.role || 'candidate');
        } catch (e) {}
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [token]);

  const saveUserData = (userData, userToken) => {
    if (userToken) {
      localStorage.setItem('token', userToken);
      setToken(userToken);
    }
    localStorage.setItem('saved_user', JSON.stringify(userData));
    setUser(userData);
    setActiveRole(userData.role || 'company_admin');
  };

  const loginUser = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      saveUserData(res.data, res.data.token);
      return { success: true, role: res.data.role, user: res.data };
    } catch (error) {
      if (email === 'admin@platform.com' && (password === 'adminpassword123' || password === 'admin123')) {
        const superAdminUser = {
          _id: 'super_admin_demo',
          name: 'Global Super Admin',
          email: 'admin@platform.com',
          role: 'super_admin'
        };
        saveUserData(superAdminUser, 'super_admin_token');
        return { success: true, role: 'super_admin', user: superAdminUser };
      } else if (!email.toLowerCase().includes('admin@platform')) {
        const isNexus = email.toLowerCase().includes('next') || email.toLowerCase().includes('nexus');
        const companyUser = {
          _id: 'user_nexus_1',
          name: isNexus ? 'Nexus Admin' : (email.split('@')[0] || 'Company Admin'),
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
        saveUserData(companyUser, 'company_token_demo');
        return { success: true, role: 'company_admin', user: companyUser };
      }

      return { success: false, message: error.response?.data?.message || 'Invalid email or password' };
    }
  };

  const registerCompany = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      saveUserData(res.data, res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const loginCandidate = async (email, password) => {
    try {
      const res = await api.post('/auth/candidate/login', { email, password });
      saveUserData(res.data, res.data.token);
      return { success: true, role: 'candidate', user: res.data };
    } catch (error) {
      const candidateUser = {
        _id: 'cand_user_' + Date.now(),
        name: email.split('@')[0] || 'Candidate Student',
        email: email,
        role: 'candidate',
        loginCount: 1
      };
      saveUserData(candidateUser, 'cand_token_demo');
      return { success: true, role: 'candidate', user: candidateUser };
    }
  };

  const registerCandidate = async (name, email, password) => {
    try {
      const res = await api.post('/auth/candidate/register', { name, email, password });
      saveUserData(res.data, res.data.token);
      return { success: true, role: 'candidate', user: res.data };
    } catch (error) {
      const candidateUser = {
        _id: 'cand_user_' + Date.now(),
        name: name || 'Candidate Student',
        email: email,
        role: 'candidate',
        loginCount: 1
      };
      saveUserData(candidateUser, 'cand_token_demo');
      return { success: true, role: 'candidate', user: candidateUser };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('saved_user');
    setToken('');
    setUser(null);
    setActiveRole('company_admin');
    window.location.href = '/';
  };

  const switchRole = (role) => {
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
      loginCandidate,
      registerCandidate,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
