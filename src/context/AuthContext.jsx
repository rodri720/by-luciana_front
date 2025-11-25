// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      // Aquí podrías verificar un token en localStorage, etc.
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsAuthenticated(true);
      console.log('🔓 Sesión de administrador iniciada');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    console.log('🔒 Sesión de administrador cerrada');
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportación por defecto del contexto (opcional)
export default AuthContext;