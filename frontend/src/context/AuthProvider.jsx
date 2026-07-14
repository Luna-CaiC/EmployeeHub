import { useEffect, useMemo, useState } from 'react';
import AuthContext from './authContext.js';
import apiClient from '../services/apiClient.js';

function getStoredUser() {
  const user = localStorage.getItem('employeehub_user');
  return user ? JSON.parse(user) : null;
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('employeehub_token'));
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    apiClient
      .get('/auth/profile')
      .then((response) => {
        const profile = response.data;
        setUser(profile);
        localStorage.setItem('employeehub_user', JSON.stringify(profile));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('employeehub_token');
        localStorage.removeItem('employeehub_user');
      });
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login(loginResponse) {
        localStorage.setItem('employeehub_token', loginResponse.token);
        const loginUser = {
          username: loginResponse.username,
          role: loginResponse.role,
        };
        localStorage.setItem('employeehub_user', JSON.stringify(loginUser));
        setToken(loginResponse.token);
        setUser(loginUser);
      },
      logout() {
        localStorage.removeItem('employeehub_token');
        localStorage.removeItem('employeehub_user');
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
