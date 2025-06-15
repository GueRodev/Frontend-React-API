// API Configuration
export const API_BASE_URL = 'https://cuarta2-api-back-main-ebjtzu.laravel.cloud/api';

// API Endpoints
export const API_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USER: '/user',


   // 👤 Endpoints de Perfil de Usuario
  USER_PROFILE: '/user/profile',
  USER_PROFILE_UPDATE: '/user/profile',
  
  // 📚 Endpoints de Materias
  MATERIAS: '/materias',
  MATERIA_DETAIL: (codigo) => `/materias/${codigo}`,
  MATERIA_UPDATE: (codigo) => `/materias/${codigo}`,
  MATERIA_DELETE: (codigo) => `/materias/${codigo}`,
  MATERIAS_ESTADISTICAS: '/materias/estadisticas',
  MATERIAS_BY_CARRERA: (carrera) => `/materias/carrera/${carrera}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',


  // 👤 Rutas de Perfil
  PROFILE: '/perfil',

  
  // 📚 Rutas de Materias
  MATERIAS: '/materias',
  MATERIA_DETAIL: (codigo) => `/materias/${codigo}`,
  MATERIA_NEW: '/materias/nueva',
  MATERIA_EDIT: (codigo) => `/materias/${codigo}/editar`,
};

// 📊 Configuraciones adicionales para Materias
export const MATERIA_CONFIG = {
  ITEMS_PER_PAGE: 10,
  SEARCH_DELAY: 500, // ms para debounce en búsqueda
  CARRERAS: [
    { codigo: 'IN', nombre: 'Ingeniería en Sistemas' },
    { codigo: 'AD', nombre: 'Administración de Empresas' },
    { codigo: 'CO', nombre: 'Contaduría Pública' },
    { codigo: 'II', nombre: 'Ingeniería Industrial' },
  ],
  CREDITOS_OPTIONS: [1, 2, 3, 4, 5, 6],
  NIVELES: [
    { value: 1, label: 'Primer Año' },
    { value: 2, label: 'Segundo Año' },
    { value: 3, label: 'Tercer Año' },
    { value: 4, label: 'Cuarto Año' },
    { value: 5, label: 'Quinto Año' },
  ]
};