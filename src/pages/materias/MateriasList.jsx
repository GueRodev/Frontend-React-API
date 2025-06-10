import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { materiaService } from '../../services/materiaService';
import { ROUTES, MATERIA_CONFIG } from '../../utils/constants';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
  Building2,
  BarChart3,
  RefreshCw,
  Download,
  Grid3X3,
  List
} from 'lucide-react';

const MateriasList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados principales
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  
  // Estados de filtros y búsqueda
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    carrera: '',
    creditos: '',
    nivel: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados de paginación
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: MATERIA_CONFIG.ITEMS_PER_PAGE,
    total: 0
  });

  // Estados de estadísticas
  const [stats, setStats] = useState({
    totalMaterias: 0,
    porCarrera: {},
    promedioCreditos: 0
  });

  // Debounce para búsqueda
  const [searchDebounce, setSearchDebounce] = useState(null);

  // Cargar materias
  const loadMaterias = useCallback(async (page = 1, reset = false) => {
    try {
      if (reset) setLoading(true);
      
      const params = {
        page,
        per_page: pagination.per_page,
        search: search.trim(),
        ...filters
      };

      // Remover parámetros vacíos
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await materiaService.getMaterias(params);
      
      if (response.success) {
        setMaterias(response.data.data || []);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || MATERIA_CONFIG.ITEMS_PER_PAGE,
          total: response.data.total || 0
        });
        
        // Calcular estadísticas simples
        if (response.data.data) {
          const totalCreditos = response.data.data.reduce((sum, materia) => sum + (materia.creditos || 0), 0);
          const carrerasCount = response.data.data.reduce((acc, materia) => {
            acc[materia.carrera] = (acc[materia.carrera] || 0) + 1;
            return acc;
          }, {});
          
          setStats({
            totalMaterias: response.data.total || 0,
            porCarrera: carrerasCount,
            promedioCreditos: response.data.data.length > 0 ? (totalCreditos / response.data.data.length).toFixed(1) : 0
          });
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar materias:', err);
      setError(err.message || 'Error al cargar las materias');
    } finally {
      setLoading(false);
    }
  }, [search, filters, pagination.per_page]);

  // Efecto para cargar materias iniciales
  useEffect(() => {
    loadMaterias(1, true);
  }, []);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    if (searchDebounce) clearTimeout(searchDebounce);
    
    const timeout = setTimeout(() => {
      loadMaterias(1, true);
    }, MATERIA_CONFIG.SEARCH_DELAY);
    
    setSearchDebounce(timeout);
    
    return () => clearTimeout(timeout);
  }, [search, filters]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({
      carrera: '',
      creditos: '',
      nivel: ''
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      loadMaterias(newPage);
    }
  };

  const handleViewMateria = (codigo) => {
    navigate(ROUTES.MATERIA_DETAIL(codigo));
  };

  const handleEditMateria = (codigo) => {
    navigate(ROUTES.MATERIA_EDIT(codigo));
  };

  const handleDeleteMateria = async (codigo, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar la materia "${nombre}"?`)) {
      try {
        await materiaService.deleteMateria(codigo);
        loadMaterias(pagination.current_page, true);
        // Aquí podrías agregar una notificación toast
      } catch (err) {
        alert(err.message || 'Error al eliminar la materia');
      }
    }
  };

  // Componente de tarjeta de materia
  const MateriaCard = ({ materia }) => (
    <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 transition-all duration-300 hover:border-gray-500/50 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {materia.nombre}
            </h3>
            <p className="text-gray-400 text-sm">{materia.codigo}</p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
          {materia.creditos} créditos
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Carrera:</span>
          <span className="text-white font-medium">{materia.carrera}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Nivel:</span>
          <span className="text-white font-medium">{materia.nivel}° Año</span>
        </div>
        {materia.descripcion && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {materia.descripcion}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewMateria(materia.codigo)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditMateria(materia.codigo)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteMateria(materia.codigo, materia.nombre)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {materia.updated_at ? new Date(materia.updated_at).toLocaleDateString() : 'Sin fecha'}
        </span>
      </div>
    </div>
  );

  // Componente de fila de lista
  const MateriaRow = ({ materia }) => (
    <tr className="bg-gray-800/30 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">{materia.nombre}</div>
            <div className="text-gray-400 text-sm">{materia.codigo}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-300">{materia.carrera}</td>
      <td className="px-6 py-4 text-gray-300 text-center">{materia.creditos}</td>
      <td className="px-6 py-4 text-gray-300 text-center">{materia.nivel}°</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewMateria(materia.codigo)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditMateria(materia.codigo)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteMateria(materia.codigo, materia.nombre)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading && materias.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando materias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Gestión de Materias</h1>
                <p className="text-sm text-gray-400">Administra las materias del sistema</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(ROUTES.MATERIA_NEW)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Materia
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Materias</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMaterias}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Promedio Créditos</p>
                  <p className="text-2xl font-bold text-white">{stats.promedioCreditos}</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Carreras</p>
                  <p className="text-2xl font-bold text-white">{Object.keys(stats.porCarrera).length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar materias..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    showFilters ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </button>

                <div className="flex items-center bg-gray-700/50 border border-gray-600/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => loadMaterias(pagination.current_page, true)}
                  className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-gray-700/50 transition-all"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Carrera</label>
                    <select
                      value={filters.carrera}
                      onChange={(e) => handleFilterChange('carrera', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      <option value="">Todas las carreras</option>
                      {MATERIA_CONFIG.CARRERAS.map(carrera => (
                        <option key={carrera.codigo} value={carrera.codigo}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Créditos</label>
                    <select
                      value={filters.creditos}
                      onChange={(e) => handleFilterChange('creditos', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      <option value="">Todos los créditos</option>
                      {MATERIA_CONFIG.CREDITOS_OPTIONS.map(credito => (
                        <option key={credito} value={credito}>
                          {credito} créditos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nivel</label>
                    <select
                      value={filters.nivel}
                      onChange={(e) => handleFilterChange('nivel', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      <option value="">Todos los niveles</option>
                      {MATERIA_CONFIG.NIVELES.map(nivel => (
                        <option key={nivel.value} value={nivel.value}>
                          {nivel.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Content */}
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materias.map((materia) => (
                <MateriaCard key={materia.id} materia={materia} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Materia</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Carrera</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Créditos</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Nivel</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map((materia) => (
                    <MateriaRow key={materia.id} materia={materia} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && materias.length === 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay materias</h3>
              <p className="text-gray-400 mb-6">
                {search || Object.values(filters).some(f => f) 
                  ? 'No se encontraron materias con los filtros aplicados.' 
                  : 'Aún no hay materias registradas en el sistema.'
                }
              </p>
              {!search && !Object.values(filters).some(f => f) && (
                <button
                  onClick={() => navigate(ROUTES.MATERIA_NEW)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Primera Materia
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} a {Math.min(pagination.current_page * pagination.per_page, pagination.total)} de {pagination.total} resultados
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let pageNumber;
                    if (pagination.last_page <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.current_page <= 3) {
                      pageNumber = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                      pageNumber = pagination.last_page - 4 + i;
                    } else {
                      pageNumber = pagination.current_page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          pageNumber === pagination.current_page
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MateriasList;