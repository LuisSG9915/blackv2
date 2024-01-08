import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setAuthToken: (newToken: string | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const setAuthToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const contextValue: AuthContextProps = {
    token,
    setAuthToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
