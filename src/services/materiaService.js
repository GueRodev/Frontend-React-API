import api from './apiService';
import { API_ENDPOINTS } from '../utils/constants';

// 📚 Servicio completo para Materias
export const materiaService = {
  
  // 📋 Obtener todas las materias con filtros y paginación
async getMaterias(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Agregar parámetros de filtros si existen
    if (params.search) queryParams.append('search', params.search);
    if (params.carrera) queryParams.append('carrera', params.carrera);
    if (params.creditos) queryParams.append('creditos', params.creditos);
    if (params.nivel) queryParams.append('nivel', params.nivel);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const url = `${API_ENDPOINTS.MATERIAS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    
    // CAMBIO IMPORTANTE: Envolver la respuesta en el formato esperado
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener materias' };
  }
},

  // 👁️ Obtener una materia específica por código
  async getMateriaByCode(codigo) {
    try {
      const response = await api.get(API_ENDPOINTS.MATERIA_DETAIL(codigo));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la materia' };
    }
  },

  // ➕ Crear nueva materia
  async createMateria(materiaData) {
    try {
      const response = await api.post(API_ENDPOINTS.MATERIAS, materiaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la materia' };
    }
  },

  // ✏️ Actualizar materia existente
  async updateMateria(codigo, materiaData) {
    try {
      const response = await api.put(API_ENDPOINTS.MATERIA_UPDATE(codigo), materiaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la materia' };
    }
  },

  // 🗑️ Eliminar materia
  async deleteMateria(codigo) {
    try {
      const response = await api.delete(API_ENDPOINTS.MATERIA_DELETE(codigo));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la materia' };
    }
  },

  // 📊 Obtener estadísticas de materias
  async getEstadisticas() {
    try {
      const response = await api.get(API_ENDPOINTS.MATERIAS_ESTADISTICAS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
  },

  // 🎓 Obtener materias por carrera
  async getMateriasByCarrera(codigoCarrera) {
    try {
      const response = await api.get(API_ENDPOINTS.MATERIAS_BY_CARRERA(codigoCarrera));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener materias de la carrera' };
    }
  },

  // 🔍 Buscar materias (método auxiliar para búsqueda rápida)
  async searchMaterias(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters,
        per_page: 20 // Resultados de búsqueda limitados
      };
      
      return await this.getMaterias(params);
    } catch (error) {
      throw error.response?.data || { message: 'Error en la búsqueda' };
    }
  },

  // ✅ Validar código de materia único
  async validateCodigoMateria(codigo, excludeId = null) {
    try {
      const response = await this.getMateriaByCode(codigo);
      
      // Si encontró la materia y no es la que estamos excluyendo (para edición)
      if (response.success && response.data.codigo === codigo) {
        if (excludeId && response.data.id === excludeId) {
          return { isValid: true }; // Es válido porque es la misma materia que estamos editando
        }
        return { isValid: false, message: 'El código de materia ya existe' };
      }
      
      return { isValid: true };
    } catch (error) {
      // Si da error 404, significa que no existe, por lo tanto es válido
      if (error.status === 404) {
        return { isValid: true };
      }
      throw error;
    }
  },

  // 📈 Obtener métricas rápidas para dashboard
  async getDashboardMetrics() {
    try {
      const [estadisticas, materias] = await Promise.all([
        this.getEstadisticas(),
        this.getMaterias({ per_page: 5 }) // Solo las primeras 5 para vista rápida
      ]);

      return {
        estadisticas: estadisticas.data,
        ultimasMaterias: materias.data?.data || [],
        success: true
      };
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener métricas' };
    }
  }
};

export default materiaService;