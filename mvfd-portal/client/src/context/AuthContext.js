import { createContext } from 'react';

export const AuthContext = createContext({
  token: null,
  isAuthenticated: null,
  user: null,
  login: () => {},
  logout: () => {},
});