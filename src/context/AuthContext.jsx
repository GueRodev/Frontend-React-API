import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../services/apiService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay token en localStorage
        if (authService.isAuthenticated()) {
          // Intentar obtener usuario actual del servidor
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Si falla, limpiar localStorage
            await authService.logout();
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si hay error, limpiar localStorage
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || 'Error en login' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.message || 'Error de conexión',
        errors: error.errors || {}
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro - SIN login automático
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        // ✅ NO establecer usuario como autenticado
        // Solo retornar éxito para mostrar mensaje
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || 'Error en registro' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.message || 'Error de conexión',
        errors: error.errors || {}
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // 👤 Nueva función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        // Actualizar el estado del usuario con los nuevos datos
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || 'Error al actualizar perfil' };
      }
    } catch (error) {
      console.error('Error en actualización de perfil:', error);
      return { 
        success: false, 
        message: error.message || 'Error de conexión',
        errors: error.errors || {}
      };
    } finally {
      setLoading(false);
    }
  };

  // 👤 Nueva función para obtener perfil actualizado
  const refreshProfile = async () => {
    try {
      const response = await profileService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Error al refrescar perfil:', error);
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  // Valores del contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};