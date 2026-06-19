import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/auth/me", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/auth/me", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
    return null;
  };

  const handleLogin = async (email, password, isSignUp) => {
    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(`https://guraneza.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Cannot connect to server." };
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.access_token }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Cannot connect to server." };
    }
  };

  const logout = async () => {
    await fetch("https://guraneza.onrender.com/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleGoogleLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}