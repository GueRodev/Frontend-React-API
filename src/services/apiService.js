import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

// Configurar axios con base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Redirigir al login si estamos en una ruta protegida
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registro de usuario - SIN login automático
  async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      
      // ✅ NO guardar token automáticamente - solo retornar respuesta
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Login de usuario
  async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      
      // Guardar token y usuario automáticamente solo en LOGIN
      if (response.data.success && response.data.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Logout de usuario
  async logout() {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Incluso si el logout falla en el servidor, limpiamos el localStorage
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpiar localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.USER);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Obtener usuario del localStorage
  getUser() {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    return userString ? JSON.parse(userString) : null;
  }
};

// Servicios de perfil de usuario
export const profileService = {
  // Obtener información completa del perfil
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener información del perfil' };
    }
  },

  // Actualizar información del perfil
  async updateProfile(profileData) {
    try {
      const response = await api.put(API_ENDPOINTS.USER_PROFILE_UPDATE, profileData);
      
      // Actualizar usuario en localStorage si la actualización es exitosa
      if (response.data.success && response.data.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el perfil' };
    }
  }
};

export default api;