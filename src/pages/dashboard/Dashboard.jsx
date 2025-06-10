import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  GraduationCap,
  Building2,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  Bell,
  Search,
  Menu
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNotifications, setActiveNotifications] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Datos de módulos
  const modules = [
    {
      id: 'materias',
      title: 'Materias',
      description: 'Gestión de materias y asignaturas',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      stats: '45 materias',
      path: '/materias',
      implemented: true
    },
    {
      id: 'estudiantes',
      title: 'Estudiantes',
      description: 'Registro y gestión de estudiantes',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      stats: '1,240 estudiantes',
      path: '/estudiantes',
      implemented: false
    },
    {
      id: 'carreras',
      title: 'Carreras',
      description: 'Gestión de carreras universitarias',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      stats: '8 carreras',
      path: '/carreras',
      implemented: false
    },
    {
      id: 'matricula',
      title: 'Matrícula',
      description: 'Proceso de matrícula y asignaciones',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      stats: 'Período activo',
      path: '/matricula',
      implemented: false
    },
    {
      id: 'expediente',
      title: 'Expediente Académico',
      description: 'Record y progreso académico',
      icon: BarChart3,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      stats: 'Vista completa',
      path: '/expediente',
      implemented: false
    },
    {
      id: 'perfil',
      title: 'Perfil',
      description: 'Configuración y datos personales',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700',
      stats: 'Configurar',
      path: '/perfil',
      implemented: true
    }
  ];

  // Función mejorada para manejar navegación de módulos
  const handleModuleClick = (module) => {
    if (module.implemented) {
      navigate(module.path);
    } else {
      // Mostrar mensaje temporal para módulos no implementados
      alert(`El módulo "${module.title}" estará disponible próximamente.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Mejorado con mejor responsive */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            
            {/* Logo y Navegación - Optimizado para móvil */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-white">UTA</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">Sistema Universitario</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Panel de Administración</p>
              </div>
            </div>

            {/* Barra de búsqueda - Solo visible en desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar estudiantes, materias..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                />
              </div>
            </div>

            {/* Menu Usuario - Optimizado para móvil */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              
              {/* Búsqueda móvil */}
              <button className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                <Search className="h-5 w-5" />
              </button>

              {/* Notificaciones */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {activeNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      <span className="text-xs hidden sm:inline">{activeNotifications}</span>
                      <span className="w-1 h-1 bg-white rounded-full sm:hidden"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Info Usuario - Responsive */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white truncate max-w-32">{user?.name}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                </div>
              </div>

              {/* Logout - Solo desktop */}
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-3 py-2 border border-red-600/50 text-sm font-medium rounded-xl text-red-400 hover:bg-red-600/10 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4 lg:px-8 pb-24 sm:pb-8">
        <div className="space-y-6 sm:space-y-8">
          
          {/* Welcome Section - Mejorado para móvil */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-green-400 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    ¡Bienvenido, <span className="sm:inline">{user?.name}!</span>
                  </h2>
                  <p className="text-green-200 mt-1 text-sm sm:text-base">
                    Gestiona el sistema universitario desde aquí
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-green-200 text-sm">Último acceso</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Rápidas - Grid responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Estudiantes</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">1,240</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Materias Activas</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">45</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Carreras</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">8</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Módulos Principales */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-bold text-white">Módulos del Sistema</h3>
              <p className="text-gray-400 text-sm">Selecciona un módulo para comenzar</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module)}
                    className={`group bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:border-gray-500/50 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-1 ${
                      !module.implemented ? 'opacity-75 hover:opacity-90' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br ${module.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${
                        !module.implemented ? 'opacity-75' : ''
                      }`}>
                        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-green-400 transition-colors flex-1">
                          {module.title}
                        </h4>
                        {!module.implemented && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 ml-2 flex-shrink-0">
                            Próximamente
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {module.description}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 group-hover:bg-green-500/20 group-hover:text-green-300 transition-all">
                          {module.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información del Usuario - Responsiva */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6">Información de la Cuenta</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-400 text-sm">Nombre completo</p>
                    <p className="text-white font-medium truncate">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-400 text-sm">Correo electrónico</p>
                    <p className="text-white font-medium truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-400 text-sm">Miembro desde</p>
                    <p className="text-white font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg sm:rounded-xl">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center flex-shrink-0">
                    <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${user?.email_verified_at ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-sm">Estado de verificación</p>
                    <p className="text-white font-medium">
                      {user?.email_verified_at ? 'Verificado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botón flotante de cerrar sesión - Solo móvil */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent">
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 shadow-lg"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;