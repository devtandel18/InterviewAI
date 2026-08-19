import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { registerRequest, loginRequest, getMeRequest } from "../api/authApi";
import { applyTheme } from "../utils/applyTheme";

const AuthContext = createContext(null);

const TOKEN_KEY = "interviewai_token";
const USER_KEY = "interviewai_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
    applyTheme(user.theme || "system");
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getMeRequest()
      .then(({ user }) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setUser(user);
        applyTheme(user.theme || "system");
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (payload) => {
    const { user, token } = await registerRequest(payload);
    persistSession(user, token);
    return user;
  }, []);

  const login = useCallback(async (payload) => {
    const { user, token } = await loginRequest(payload);
    persistSession(user, token);
    return user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}